import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import * as Speech from 'expo-speech';

type VibrationIntensity = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';
type Command = 'start' | 'stop' | 'detect' | 'help' | 'direction';

interface CommandHandler {
  (command?: string): void;
}

export class AccessibilityFeedback {
  private static recognition: any = null;
  private static isListening: boolean = false;
  private static commandHandlers: Record<Command, CommandHandler> = {
    start: () => {},
    stop: () => {},
    detect: () => {},
    help: () => {},
    direction: () => {},
  };

  static initSpeechRecognition(commandHandlers?: Partial<Record<Command, CommandHandler>>) {
    // Update command handlers if provided
    if (commandHandlers) {
      this.commandHandlers = { ...this.commandHandlers, ...commandHandlers };
    }

    // Setup speech recognition
    if (Platform.OS === 'web' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = false;
      
      this.recognition.onstart = () => {
        this.speak('Voice recognition is active');
        this.isListening = true;
      };

      this.recognition.onend = () => {
        this.isListening = false;
        // Auto-restart if still supposed to be listening
        if (this.recognition && this.isListening) {
          setTimeout(() => {
            try {
              this.recognition.start();
            } catch (e) {
              console.error('Failed to restart speech recognition:', e);
            }
          }, 1000);
        }
      };
      
      this.recognition.onresult = (event: any) => {
        const last = event.results.length - 1;
        const command = event.results[last][0].transcript.toLowerCase().trim();
        
        // Process voice commands
        if (command.includes('start') || command.includes('begin')) {
          this.speak('Starting obstacle detection');
          this.vibrate('success');
          this.commandHandlers.start();
        } else if (command.includes('stop') || command.includes('end') || command.includes('pause')) {
          this.speak('Stopping obstacle detection');
          this.vibrate('warning');
          this.commandHandlers.stop();
        } else if (command.includes('detect') || command.includes('scan')) {
          this.speak('Scanning for obstacles');
          this.vibrate('medium');
          this.commandHandlers.detect();
        } else if (command.includes('help') || command.includes('assist')) {
          this.speak('Available commands are: start, stop, detect, scan, and help.');
          this.vibrate('light');
          this.commandHandlers.help();
        } else if (command.includes('where') || command.includes('direction') || command.includes('location')) {
          this.speak('Detecting direction');
          this.vibrate('medium');
          this.commandHandlers.direction(command);
        }
      };

      this.recognition.onerror = (event: any) => {
        console.log('Speech recognition error:', event.error);
        
        if (event.error === 'no-speech') {
          // Don't announce this as it would be too frequent
          console.log('No speech detected');
        } else if (event.error === 'aborted') {
          // Recognition was aborted
          this.isListening = false;
        } else if (event.error === 'network') {
          this.speak('Network error. Please check your internet connection.');
        } else {
          // Try to restart if not a terminal error
          if (this.isListening) {
            setTimeout(() => this.startListening(), 3000);
          }
        }
      };
    } else if (Platform.OS !== 'web') {
      // For native platforms, we would need a different approach
      // This is a placeholder for native speech recognition implementation
      console.log('Native speech recognition not implemented yet');
    }
  }

  static startListening() {
    if (Platform.OS === 'web' && 'webkitSpeechRecognition' in window) {
      if (this.recognition && !this.isListening) {
        try {
          this.recognition.start();
          this.isListening = true;
        } catch (e) {
          console.error('Failed to start speech recognition:', e);
        }
      }
    }
  }

  static stopListening() {
    if (Platform.OS === 'web' && 'webkitSpeechRecognition' in window) {
      if (this.recognition && this.isListening) {
        try {
          this.recognition.stop();
          this.speak('Voice recognition deactivated');
          this.isListening = false;
        } catch (e) {
          console.error('Failed to stop speech recognition:', e);
        }
      }
    }
  }

  static vibrate(intensity: VibrationIntensity): void {
    if (Platform.OS !== 'web') {
      switch (intensity) {
        case 'light':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
        case 'medium':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          break;
        case 'heavy':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          break;
        case 'success':
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          break;
        case 'warning':
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          break;
        case 'error':
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          break;
      }
    }
  }

  static async speak(text: string, options?: { rate?: number; pitch?: number; interrupt?: boolean }): Promise<void> {
    const defaultOptions = { rate: 1.0, pitch: 1.2, interrupt: true };
    const mergedOptions = { ...defaultOptions, ...options };
    
    if (Platform.OS === 'web' && 'speechSynthesis' in window) {
      if (mergedOptions.interrupt) {
        window.speechSynthesis.cancel();
      }
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = mergedOptions.rate;
      utterance.pitch = mergedOptions.pitch;
      utterance.volume = 1.0;
      
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.lang.startsWith('en') && 
        voice.name.toLowerCase().includes('female')
      );
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      window.speechSynthesis.speak(utterance);
    } else {
      // Use expo-speech for native platforms
      try {
        // First stop any current speech if interrupting
        if (mergedOptions.interrupt) {
          await Speech.stop();
        }
        
        await Speech.speak(text, {
          language: 'en',
          pitch: mergedOptions.pitch,
          rate: mergedOptions.rate,
        });
      } catch (error) {
        console.error('Speech error:', error);
      }
    }
  }

  static announceSystemStart(): void {
    this.speak('Welcome to EYES. System initializing. Please wait.');
    this.vibrate('medium');
  }

  static announceSystemReady(): void {
    this.speak('System ready. Tap the button below to select a visibility mode.');
    this.vibrate('success');
  }

  static announceMode(mode: string): void {
    const messages = {
      'Low Vision': 'Low Vision mode activated. This mode provides visual aids and high contrast elements for users with partial vision. Tap the large button to start detection.',
      'Total Blindness': 'Total Blindness mode activated. Full audio guidance and voice commands are enabled. Say "start" to begin detection, or tap anywhere on the screen. Say "help" for a list of available commands.',
    };
    
    this.speak(messages[mode] || mode);
    this.vibrate('success');

    if (mode === 'Total Blindness') {
      this.startListening();
    } else {
      this.stopListening();
    }
  }

  static announceModeSelection(): void {
    this.speak('Please select your visibility mode. Choose Low Vision mode if you have partial vision, or Total Blindness mode if you have no vision.');
    this.vibrate('medium');
  }

  static announceDetectionStart(): void {
    this.speak('Detection started. The system will now alert you of any obstacles in your path.');
    this.vibrate('success');
  }

  static announceDetectionStop(): void {
    this.speak('Detection stopped. Tap the button again to resume detection.');
    this.vibrate('warning');
  }

  static obstacleAlert(distance: string, direction: string): void {
    const message = `Obstacle detected ${distance} meters ${direction}`;
    this.speak(message);
    this.vibrate('warning');
  }
}
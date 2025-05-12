import { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Platform } from 'react-native';
import { useAccessibilityContext } from '@/context/AccessibilityContext';
import { ModeSelectionModal } from '@/components/ModeSelectionModal';
import { CameraPlaceholder } from '@/components/CameraPlaceholder';
import { AccessibilityFeedback } from '@/utils/AccessibilityFeedback';
import { AccessibilityButton } from '@/components/AccessibilityButton';
import { COLORS } from '@/constants/Colors';
import { StatusBar } from 'expo-status-bar';

export default function CameraScreen() {
  const { mode } = useAccessibilityContext();
  const [modalVisible, setModalVisible] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isDetecting, setIsDetecting] = useState(false);

  // Toggle detection function
  const toggleDetection = () => {
    setIsDetecting(!isDetecting);
    if (!isDetecting) {
      AccessibilityFeedback.announceDetectionStart();
    } else {
      AccessibilityFeedback.announceDetectionStop();
    }
    const message = !isDetecting ? 'Detection Started' : 'Detection Stopped';
    showToast(message);
    AccessibilityFeedback.vibrate(!isDetecting ? 'success' : 'warning');
  };

  // Initialize speech recognition for Total Blindness mode
  useEffect(() => {
    // Set up handlers for voice commands
    AccessibilityFeedback.initSpeechRecognition({
      start: () => {
        if (!isDetecting) {
          toggleDetection();
        }
      },
      stop: () => {
        if (isDetecting) {
          toggleDetection();
        }
      },
      detect: () => {
        // Simulate a detection event
        showToast('Scanning environment');
        AccessibilityFeedback.speak('Scanning the environment for obstacles.');
      },
      help: () => {
        AccessibilityFeedback.speak(
          'Available commands: Say "start" to begin detection, "stop" to end detection, ' +
          '"detect" to scan the environment, or "help" to hear these commands again.'
        );
      },
      direction: () => {
        // Simulate a direction event
        const directions = ['ahead', 'to your left', 'to your right', 'behind you'];
        const randomDirection = directions[Math.floor(Math.random() * directions.length)];
        const distance = Math.floor(Math.random() * 5) + 1;
        
        AccessibilityFeedback.obstacleAlert(distance.toString(), randomDirection);
      }
    });

    // Announce system ready when component mounts
    AccessibilityFeedback.announceSystemReady();

    return () => {
      // Clean up by stopping speech recognition if needed
      if (mode === 'Total Blindness') {
        AccessibilityFeedback.stopListening();
      }
    };
  }, []);

  // Handle mode changes
  useEffect(() => {
    if (mode === 'Total Blindness') {
      AccessibilityFeedback.startListening();
    } else {
      AccessibilityFeedback.stopListening();
    }
  }, [mode]);

  const showToast = (message: string) => {
    setToastMessage(message);
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
    }, 3000);
  };

  const handleButtonPress = () => {
    if (mode === '') {
      // If no mode is selected, show mode selection modal
      AccessibilityFeedback.vibrate('medium');
      setModalVisible(true);
      AccessibilityFeedback.announceModeSelection();
    } else {
      // Toggle detection
      toggleDetection();
    }
  };

  const handleModeSelected = () => {
    setModalVisible(false);
    showToast(`${mode} Mode Enabled`);
    AccessibilityFeedback.announceMode(mode);
    
    // Automatically start detection after mode selection
    setIsDetecting(true);
    AccessibilityFeedback.announceDetectionStart();
  };

  // Determine what UI elements to show based on the selected mode
  const showFullUI = mode === 'Low Vision' || mode === '';

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Camera Placeholder */}
      <CameraPlaceholder />
      
      {/* Mode Indicator (visible in both modes for screen readers) */}
      {toastVisible && (
        <View 
          style={[styles.toastContainer, !showFullUI && styles.invisibleToast]}
          accessible={true}
          accessibilityLabel={toastMessage}
          accessibilityRole="alert"
        >
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      )}
      
      {/* Help Text (for Low Vision mode) */}
      {showFullUI && mode === '' && (
        <View style={styles.helpTextContainer}>
          <Text style={styles.helpText}>
            Tap the button below to select a visibility mode
          </Text>
        </View>
      )}
      
      {/* Large Accessibility Button */}
      <AccessibilityButton 
        onPress={handleButtonPress} 
        label={isDetecting ? "Stop Detection" : "Start Detection"}
        hideVisuals={mode === 'Total Blindness'}
        isDetecting={isDetecting}
      />
      
      {/* Mode Selection Modal */}
      <ModeSelectionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onModeSelected={handleModeSelected}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  toastContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
  },
  invisibleToast: {
    opacity: 0, // Visually hidden but still accessible to screen readers
  },
  toastText: {
    color: COLORS.accent,
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    textAlign: 'center',
  },
  helpTextContainer: {
    position: 'absolute',
    top: 100,
    left: 20,
    right: 20,
    padding: 15,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 10,
  },
  helpText: {
    color: 'white',
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    textAlign: 'center',
  },
});
import React, { useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
} from 'react-native';
import { COLORS } from '@/constants/Colors';
import { Eye, EyeOff } from 'lucide-react-native';
import { useAccessibilityContext } from '@/context/AccessibilityContext';
import { AccessibilityFeedback } from '@/utils/AccessibilityFeedback';

interface ModeSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onModeSelected: () => void;
}

export const ModeSelectionModal: React.FC<ModeSelectionModalProps> = ({
  visible,
  onClose,
  onModeSelected,
}) => {
  const { mode, setMode } = useAccessibilityContext();
  const slideAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
      
      // Announce mode selection options when modal opens
      AccessibilityFeedback.speak(
        'Select Visibility Mode. Choose between Low Vision Mode for partial vision or Total Blindness Mode for no vision.'
      );
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim]);

  const handleModeSelect = (selectedMode: string) => {
    setMode(selectedMode);
    
    // Announce the selected mode
    if (selectedMode === 'Low Vision') {
      AccessibilityFeedback.speak('Low Vision Mode selected. This mode provides visual aids and high contrast elements.');
    } else {
      AccessibilityFeedback.speak('Total Blindness Mode selected. This mode focuses on audio and haptic feedback.');
    }
    
    AccessibilityFeedback.vibrate('light');
    onModeSelected();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <View style={styles.modalOverlay}>
        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [
                {
                  translateY: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [600, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.modalHeader}>
            <View style={styles.modalHandleBar} />
            <Text style={styles.modalTitle}>Choose Visibility Mode</Text>
            <Text style={styles.modalSubtitle}>
              Select the mode that works best for your vision needs
            </Text>
          </View>

          <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={[
                styles.optionButton,
                mode === 'Low Vision' && styles.activeMode,
              ]}
              onPress={() => handleModeSelect('Low Vision')}
              accessibilityRole="radio"
              accessibilityState={{ checked: mode === 'Low Vision' }}
              accessibilityLabel="Low Vision Mode"
              accessibilityHint="Select this mode if you have partial vision. Provides visual aids and high contrast elements."
            >
              <View style={styles.optionIconContainer}>
                <Eye size={32} color={COLORS.accent} />
              </View>
              <Text style={styles.optionTitle}>Low Vision Mode</Text>
              <Text style={styles.optionDescription}>
                Provides high contrast visual cues with large elements
              </Text>
              <View
                style={[
                  styles.selectionIndicator,
                  mode === 'Low Vision' && styles.selected,
                ]}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionButton,
                mode === 'Total Blindness' && styles.activeMode,
              ]}
              onPress={() => handleModeSelect('Total Blindness')}
              accessibilityRole="radio"
              accessibilityState={{ checked: mode === 'Total Blindness' }}
              accessibilityLabel="Total Blindness Mode"
              accessibilityHint="Select this mode if you have no vision. Focuses on audio and haptic feedback."
            >
              <View style={styles.optionIconContainer}>
                <EyeOff size={32} color={COLORS.accent} />
              </View>
              <Text style={styles.optionTitle}>Total Blindness Mode</Text>
              <Text style={styles.optionDescription}>
                Focuses on audio and haptic feedback, minimizes visual elements
              </Text>
              <View
                style={[
                  styles.selectionIndicator,
                  mode === 'Total Blindness' && styles.selected,
                ]}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.closeButton}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Cancel"
            accessibilityHint="Close this dialog without making a selection"
          >
            <Text style={styles.closeButtonText}>Cancel</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: COLORS.primaryDark,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    minHeight: 500,
  },
  modalHeader: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalHandleBar: {
    width: 40,
    height: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
    marginBottom: 20,
  },
  modalTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: 'white',
    marginBottom: 8,
  },
  modalSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  optionsContainer: {
    padding: 20,
  },
  optionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 218, 48, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  optionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: 'white',
    marginBottom: 8,
  },
  optionDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 22,
  },
  selectionIndicator: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 4,
    backgroundColor: 'transparent',
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  selected: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },
  activeMode: {
    borderColor: COLORS.accent,
    backgroundColor: 'rgba(255, 218, 48, 0.2)',
  },
  closeButton: {
    marginTop: 10,
    marginHorizontal: 20,
    padding: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: 'white',
  },
});
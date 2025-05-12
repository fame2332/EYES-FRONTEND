import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View, AccessibilityInfo } from 'react-native';
import { COLORS } from '@/constants/Colors';
import { Eye } from 'lucide-react-native';

interface AccessibilityButtonProps {
  onPress: () => void;
  label: string;
  hideVisuals?: boolean;
  isDetecting?: boolean;
}

export const AccessibilityButton: React.FC<AccessibilityButtonProps> = ({
  onPress,
  label,
  hideVisuals = false,
  isDetecting = false,
}) => {
  // For Total Blindness mode, create a button that is visually hidden but accessible
  if (hideVisuals) {
    return (
      <TouchableOpacity
        style={[styles.container, styles.invisibleContainer]}
        onPress={onPress}
        accessible={true}
        accessibilityLabel={isDetecting ? "Stop Detection" : "Start Detection"}
        accessibilityRole="button"
        accessibilityHint="Double tap to toggle detection. In Total Blindness mode, you can also use voice commands like 'start' or 'stop'."
        accessibilityState={{ checked: isDetecting }}
        accessibilityLiveRegion="polite"
      >
        {/* This is an invisible button that covers most of the screen for easier access */}
        <View pointerEvents="none" />
      </TouchableOpacity>
    );
  }

  // For Low Vision mode, show the standard button with visual elements
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      accessible={true}
      accessibilityLabel={isDetecting ? "Stop Detection" : "Start Detection"}
      accessibilityRole="button"
      accessibilityHint="Double tap to toggle obstacle detection"
      accessibilityState={{ checked: isDetecting }}
    >
      <View style={[styles.button, isDetecting && styles.buttonActive]}>
        <Eye size={64} color={COLORS.primaryDark} strokeWidth={2.5} />
      </View>
      <Text style={styles.label}>
        {isDetecting ? 'Stop Detection' : 'Start Detection'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  invisibleContainer: {
    // For total blindness mode, make the touch target much larger but invisible
    width: '100%',
    height: '70%', // Cover most of the bottom part of the screen
    bottom: 0,
    opacity: 0, // Make it invisible but still interactable
  },
  button: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  buttonActive: {
    backgroundColor: COLORS.warning, // Change color when detecting
  },
  label: {
    marginTop: 16,
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: 'white',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    overflow: 'hidden',
    textAlign: 'center',
  },
});
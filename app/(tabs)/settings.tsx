import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS } from '@/constants/Colors';
import { useAccessibilityContext } from '@/context/AccessibilityContext';
import { AccessibilityFeedback } from '@/utils/AccessibilityFeedback';
import { Eye, VolumeX, Volume2, Vibrate, Info } from 'lucide-react-native';

export default function SettingsScreen() {
  const { mode, setMode } = useAccessibilityContext();

  const handleModeChange = (newMode: string) => {
    setMode(newMode);
    AccessibilityFeedback.speak(`${newMode} Mode activated`);
    AccessibilityFeedback.vibrate('success');
  };

  const settingItem = (
    title: string,
    description: string,
    icon: JSX.Element,
    action?: () => void
  ) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={action}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityHint={description}
    >
      <View style={styles.settingIconContainer}>{icon}</View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSubtitle}>Customize your experience</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Visibility Mode</Text>
          <View style={styles.modeContainer}>
            <TouchableOpacity
              style={[
                styles.modeButton,
                mode === 'Low Vision' && styles.activeMode,
              ]}
              onPress={() => handleModeChange('Low Vision')}
              accessibilityRole="radio"
              accessibilityState={{ checked: mode === 'Low Vision' }}
              accessibilityLabel="Low Vision Mode"
              accessibilityHint="Maintains visual feedback with high contrast"
            >
              <Text
                style={[
                  styles.modeText,
                  mode === 'Low Vision' && styles.activeModeText,
                ]}
              >
                Low Vision
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.modeButton,
                mode === 'Total Blindness' && styles.activeMode,
              ]}
              onPress={() => handleModeChange('Total Blindness')}
              accessibilityRole="radio"
              accessibilityState={{ checked: mode === 'Total Blindness' }}
              accessibilityLabel="Total Blindness Mode"
              accessibilityHint="Focuses on audio and haptic feedback"
            >
              <Text
                style={[
                  styles.modeText,
                  mode === 'Total Blindness' && styles.activeModeText,
                ]}
              >
                Total Blindness
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Feedback Options</Text>
          {settingItem(
            'Audio Guidance',
            'Enable or disable voice instructions',
            <Volume2 size={24} color={COLORS.accent} />,
            () => AccessibilityFeedback.speak('Audio guidance enabled')
          )}

          {settingItem(
            'Haptic Feedback',
            'Control vibration intensity for alerts',
            <Vibrate size={24} color={COLORS.accent} />,
            () => AccessibilityFeedback.vibrate('medium')
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          {settingItem(
            'About EYES',
            'Learn more about this application',
            <Info size={24} color={COLORS.accent} />,
            () => AccessibilityFeedback.speak('About EYES, Effective Yielding Enroute System')
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryDark,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: COLORS.primaryDarker,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: 'white',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Extra padding for tab bar
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: 'white',
    marginBottom: 16,
  },
  modeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  modeButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 6,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activeMode: {
    borderColor: COLORS.accent,
    backgroundColor: 'rgba(255, 218, 48, 0.2)',
  },
  modeText: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: 'white',
  },
  activeModeText: {
    color: COLORS.accent,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
  },
  settingIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: 'white',
    marginBottom: 4,
  },
  settingDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
});
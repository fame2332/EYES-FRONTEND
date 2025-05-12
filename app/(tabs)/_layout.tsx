import { Tabs } from 'expo-router';
import { Eye, Settings } from 'lucide-react-native';
import { COLORS } from '@/constants/Colors';
import { Platform, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: COLORS.accent,
        tabBarInactiveTintColor: '#FFF',
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarIconStyle: styles.tabBarIcon,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Camera',
          tabBarIcon: ({ color, size }) => <Eye size={size} color={color} />,
          tabBarAccessibilityLabel: 'Camera view to detect obstacles',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Settings size={size} color={color} />
          ),
          tabBarAccessibilityLabel: 'App settings and preferences',
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Platform.OS === 'ios' ? 'transparent' : COLORS.primaryDark,
    borderTopWidth: 0,
    elevation: 0,
    height: 80,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...(Platform.OS === 'ios' ? { position: 'absolute' } : {}),
  },
  tabBarLabel: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    marginBottom: 8,
  },
  tabBarIcon: {
    marginTop: 8,
  },
});
import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Image, BackHandler } from 'react-native';
import { router } from 'expo-router';
import { Eye } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '@/constants/Colors';

export default function SplashScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  
  // Create individual animation values for each dot
  const dot1Anim = useRef(new Animated.Value(0.3)).current;
  const dot2Anim = useRef(new Animated.Value(0.3)).current;
  const dot3Anim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // Handle hardware back button - prevent going back during splash
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);
    
    // Animate logo appearance
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Animate loading dots with individual animations
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(dot1Anim, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(dot2Anim, { toValue: 0.3, duration: 300, useNativeDriver: true }),
          Animated.timing(dot3Anim, { toValue: 0.3, duration: 300, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(dot1Anim, { toValue: 0.3, duration: 300, useNativeDriver: true }),
          Animated.timing(dot2Anim, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(dot3Anim, { toValue: 0.3, duration: 300, useNativeDriver: true }),
        ]),
        Animated.parallel([
          Animated.timing(dot1Anim, { toValue: 0.3, duration: 300, useNativeDriver: true }),
          Animated.timing(dot2Anim, { toValue: 0.3, duration: 300, useNativeDriver: true }),
          Animated.timing(dot3Anim, { toValue: 1, duration: 300, useNativeDriver: true }),
        ]),
      ])
    ).start();

    // Navigate to main screen after 4 seconds
    const timer = setTimeout(() => {
      router.replace('/(tabs)');
    }, 4000);

    return () => {
      clearTimeout(timer);
      backHandler.remove();
    };
  }, [fadeAnim, scaleAnim, dot1Anim, dot2Anim, dot3Anim]);

  return (
    <LinearGradient
      colors={[COLORS.primaryDark, COLORS.primaryDarker]}
      style={styles.container}
    >
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.logoBackground}>
          <Eye size={64} color={COLORS.accent} strokeWidth={2.5} />
        </View>

        <Text style={styles.title}>EYES</Text>
        <Text style={styles.subtitle}>
          <Text style={{ color: COLORS.accent }}>E</Text>ffective{' '}
          <Text style={{ color: COLORS.accent }}>Y</Text>ielding{' '}
          <Text style={{ color: COLORS.accent }}>E</Text>nroute{' '}
          <Text style={{ color: COLORS.accent }}>S</Text>ystem
        </Text>
      </Animated.View>

      <View style={styles.loadingContainer}>
        <View style={styles.loadingDots}>
          <Animated.View style={[styles.loadingDot, { opacity: dot1Anim }]} />
          <Animated.View style={[styles.loadingDot, { opacity: dot2Anim }]} />
          <Animated.View style={[styles.loadingDot, { opacity: dot3Anim }]} />
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBackground: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontFamily: 'Inter-Black',
    fontSize: 48,
    fontWeight: '900',
    color: 'white',
    letterSpacing: 8,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 18,
    color: 'white',
    marginTop: 10,
    letterSpacing: 1,
  },
  loadingContainer: {
    position: 'absolute',
    bottom: 60,
    alignItems: 'center',
  },
  loadingDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loadingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.accent,
    marginHorizontal: 5,
  },
});
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Platform, AppState } from 'react-native';
import { COLORS } from '@/constants/Colors';
import { useAccessibilityContext } from '@/context/AccessibilityContext';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useIsFocused } from '@react-navigation/native';

export const CameraPlaceholder: React.FC = () => {
  const context = useAccessibilityContext();
  // Add safety check for undefined context
  const mode = context?.mode ?? '';
  
  const [label, setLabel] = useState('Initializing camera...');
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraActive, setCameraActive] = useState(false);
  const isFocused = useIsFocused();
  const [appState, setAppState] = useState(AppState.currentState);
  
  // Handle camera permission and initialization
  const initializeCamera = async () => {
    setLabel('Initializing camera...');
    setCameraActive(false);
    
    try {
      const cameraPermission = await requestPermission();
      if (cameraPermission.granted) {
        setCameraActive(true);
        setLabel('Camera ready');
      } else {
        setLabel('Camera permission required');
      }
    } catch (error) {
      setLabel('Camera error');
      console.error('Camera initialization error:', error);
    }
  };
  
  // Handle focus changes (when navigating between tabs)
  useEffect(() => {
    if (isFocused) {
      initializeCamera();
    } else {
      setCameraActive(false);
    }
  }, [isFocused]);
  
  // Handle app state changes (when app goes to background/foreground)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      setAppState(nextAppState);
      
      // If app comes back to active state and component is focused
      if (
        (appState === 'inactive' || appState === 'background') && 
        nextAppState === 'active' && 
        isFocused
      ) {
        initializeCamera();
      }
    });
    
    return () => {
      subscription.remove();
    };
  }, [appState, isFocused]);

  const showFullUI = mode === 'Low Vision' || mode === '';
  const dotColor = label === 'Camera ready' ? COLORS.accent : COLORS.warning;

  // Show placeholder for web platform
  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <Text style={styles.placeholderText}>
          Camera not available in web browser
        </Text>
      </View>
    );
  }

  // Show permission request UI
  if (!permission?.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.placeholderText}>Camera permission required</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {cameraActive && isFocused && (
        <CameraView
          style={styles.camera}
          facing="back"
        >
          {showFullUI && (
            <>
              <View style={styles.statusIndicator}>
                <View style={[
                  styles.statusDot,
                  { backgroundColor: dotColor }
                ]} />
                <Text style={styles.statusText}>{label}</Text>
              </View>
              
              <View style={styles.gridContainer}>
                <View style={styles.gridRowHorizontal} />
                <View style={styles.gridRowVertical} />
              </View>
              
              <View style={styles.cornerTopLeft} />
              <View style={styles.cornerTopRight} />
              <View style={styles.cornerBottomLeft} />
              <View style={styles.cornerBottomRight} />
            </>
          )}
        </CameraView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  camera: {
    width: '100%',
    height: '100%',
  },
  placeholderText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    marginTop: 16,
  },
  statusIndicator: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 12,
    borderRadius: 20,
    zIndex: 10,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    color: 'white',
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  gridContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  gridRowHorizontal: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '50%',
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  gridRowVertical: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '50%',
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  cornerTopLeft: {
    position: 'absolute',
    top: 40,
    left: 40,
    width: 50,
    height: 50,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: COLORS.accent,
    borderTopLeftRadius: 10,
  },
  cornerTopRight: {
    position: 'absolute',
    top: 40,
    right: 40,
    width: 50,
    height: 50,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: COLORS.accent,
    borderTopRightRadius: 10,
  },
  cornerBottomLeft: {
    position: 'absolute',
    bottom: 140,
    left: 40,
    width: 50,
    height: 50,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: COLORS.accent,
    borderBottomLeftRadius: 10,
  },
  cornerBottomRight: {
    position: 'absolute',
    bottom: 140,
    right: 40,
    width: 50,
    height: 50,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: COLORS.accent,
    borderBottomRightRadius: 10,
  },
});
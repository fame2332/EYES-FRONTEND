# EYES: Effective Yielding Enroute System

EYES is an accessibility-focused mobile application designed to assist users with visual impairments in navigating their surroundings. The application provides real-time obstacle detection, audio feedback, and haptic responses to enhance mobility and independence.

![EYES App]

## 🚀 Features

### Accessibility Modes
- **Low Vision Mode**: Provides high-contrast visual cues with large elements for users with partial vision
- **Total Blindness Mode**: Focuses on audio and haptic feedback, minimizing visual elements

### Object Detection via YOLO Algorithm
The app uses computer vision powered by the YOLO (You Only Look Once) algorithm to detect both static and dynamic objects in the user's environment.
- Identifies obstacles in the user's path
- Calculates distance to obstacles
- Determines obstacle positioning (left, right, ahead)

### Audio Feedback
- Voice announcements for application status and detected obstacles
- Spatial audio cues for directional guidance
- Voice command recognition for hands-free operation

### Haptic Feedback
- Various vibration patterns to indicate different types of obstacles
- Intensity variations based on proximity to hazards
- Directional feedback to guide users around obstacles

### Voice Commands
In Total Blindness mode, users can control the app with voice commands:
- "Start" or "Begin" - Start obstacle detection
- "Stop" or "End" - Stop obstacle detection
- "Detect" or "Scan" - Manually trigger an environment scan
- "Help" - Listen to available commands
- "Where" or "Direction" - Get information about obstacle locations

## 📱 Installation and Setup

### Prerequisites
- Node.js (v14 or higher)
- Expo CLI (`npm install -g expo-cli`)
- Expo Go app on iOS or Android device

### Installation
1. Download Node.js
    ```
    https://nodejs.org/dist/v22.15.0/node-v22.15.0-x64.msi
    ```
2. Open your IDE
   ```
   PyCharm
   VsCode
   IntelliJ
   ETC.
   ```
3. In terminal of the IDE Clone the repository:
   ```
   git clone https://github.com/fame2332/EYES-FRONTEND.git
   cd EYES-FRONTEND
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Scan the QR code with Expo Go app (Android) or Camera app (iOS)

## 💻 Development

### Front-End Structure
The app is built using React Native and Expo, focusing on front-end functionality:
- **Components**: Reusable UI elements like `CameraPlaceholder` and `AccessibilityButton`
- **Context**: Global state management with `AccessibilityContext`
- **Utilities**: Helper functions for accessibility feedback
- **Navigation**: Tab-based navigation using Expo Router

### Technology Stack
- React Native
- Expo
- TypeScript
- Expo Camera
- React Navigation
- Expo Speech
- Expo Haptics

## 🔄 Backend Integration Guidelines

The app is currently front-end only with simulated object detection. Here's how to integrate real backend services:

### Object Detection Integration

1. **YOLO Model Implementation**:
   - Replace the simulated detection in `CameraPlaceholder.tsx` with actual YOLO model processing
   - Consider using TensorFlow.js or a similar library for on-device ML processing
   - For better performance, connect to a backend service that processes camera frames

   ```typescript
   // Example integration point in CameraPlaceholder.tsx
   const processFrame = async (frame) => {
     // Send frame to backend or process locally
     const detections = await yoloProcessFrame(frame);
     handleDetections(detections);
   };
   ```

2. **Distance Calculation**:
   - Implement depth estimation algorithms to calculate actual distances
   - Consider using stereo vision if available or single-camera depth estimation techniques

### API Endpoints

For a server-based approach, implement these API endpoints:

1. **Image Processing Endpoint**:
   ```
   POST /api/detect
   Content-Type: multipart/form-data
   Body: { image: [binary data] }
   ```

2. **User Settings Sync**:
   ```
   GET /api/user/settings
   POST /api/user/settings
   ```

### Real-time Processing Tips

1. **Performance Optimization**:
   - Reduce image resolution before processing
   - Implement batch processing if appropriate
   - Consider edge ML solutions to reduce latency

2. **Battery Consumption**:
   - Implement adaptive frame rate based on movement
   - Reduce processing when device is stationary
   - Consider power-saving modes

3. **Offline Capabilities**:
   - Cache detection models for offline use
   - Implement a simpler fallback detection system when offline

### BackEnd-to-FrontEnd Communication

Update these files to connect with your backend:

1. **AccessibilityFeedback.ts**:
   - Enhance `obstacleAlert()` to handle real detection data
   - Update speech patterns based on obstacle type and urgency

2. **CameraPlaceholder.tsx**:
   - Implement camera frame capture and processing
   - Add real-time visualization of detected objects

3. **app/(tabs)/index.tsx**:
   - Connect detection toggle to backend services
   - Implement session management for continuous detection

## 🔒 Privacy and Security

When implementing backend services, ensure:

1. **Data Protection**:
   - Don't store camera images unless explicitly approved by users
   - Process sensitive data locally when possible
   - Implement proper authentication for any cloud services

2. **Permissions**:
   - Request only necessary permissions
   - Provide clear explanations for each permission
   - Implement graceful degradation when permissions are denied

## 📝 License

This project is licensed under a custom MIT License with Restricted Rights. All rights to this code and software belong exclusively to BELEN, GINETE, FANDINO, and the original developer. See the [LICENSE](LICENSE) file for full details.

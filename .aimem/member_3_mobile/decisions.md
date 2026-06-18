# Mobile App Specific Decisions

* **Routing & Navigation:** Expo Router (file-based routing, e.g., using `app/(tabs)/index.tsx`, `app/incident/[id].tsx`).
* **State Management:** Zustand (`useMobileStore`) for lightweight local state.
* **Styling:** Vanilla React Native `StyleSheet` styling or `NativeWind` (Tailwind for React Native) to match web dashboards. Keep styles clean and modular.
* **Audio Recording:** Use `expo-av` library to capture voice commands from the user's device microphone, outputting clean standard formats (AAC/WAV) to send to the server.
* **Push Services:** Expo Notifications API linked with EAS configurations.

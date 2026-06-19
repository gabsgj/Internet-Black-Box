import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
} from "react-native";

import { Audio } from "expo-av";

export default function VoiceScreen() {
  const [recording, setRecording] =
    useState<Audio.Recording | null>(null);

  const [isRecording, setIsRecording] =
    useState(false);

  async function startRecording() {
    try {
      await Audio.requestPermissionsAsync();

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } =
        await Audio.Recording.createAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY
        );

      setRecording(recording);
      setIsRecording(true);
    } catch (err) {
      console.log(err);
    }
  }

  async function stopRecording() {
    if (!recording) return;

    await recording.stopAndUnloadAsync();

    const uri = recording.getURI();

    console.log("Audio URI:", uri);
    alert("Recording saved successfully");

    setRecording(null);
    setIsRecording(false);
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text
        style={{
          fontSize: 24,
          marginBottom: 40,
          fontWeight: "700",
        }}
      >
        Voice Query
      </Text>

      <TouchableOpacity
        onPress={
          isRecording
            ? stopRecording
            : startRecording
        }
        style={{
          width: 150,
          height: 150,
          borderRadius: 75,
          backgroundColor: isRecording
            ? "#dc2626"
            : "#2563eb",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "white",
            fontWeight: "700",
            fontSize: 18,
          }}
        >
          {isRecording ? "STOP" : "MIC"}
        </Text>
      </TouchableOpacity>

      <Text style={{ marginTop: 30 }}>
        {isRecording
          ? "Recording..."
          : "Tap microphone to start"}
      </Text>
    </View>
  );
}
import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
} from "react-native";

export default function VoiceScreen() {
  const [recording, setRecording] =
    useState(false);

  const toggleRecording = () => {
    setRecording(!recording);
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <Text
        style={{
          fontSize: 24,
          fontWeight: "700",
          marginBottom: 40,
        }}
      >
        Voice Query
      </Text>

      <TouchableOpacity
        onPress={toggleRecording}
        style={{
          width: 140,
          height: 140,
          borderRadius: 70,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: recording
            ? "#dc2626"
            : "#2563eb",
        }}
      >
        <Text
          style={{
            color: "white",
            fontSize: 18,
            fontWeight: "700",
          }}
        >
          {recording ? "STOP" : "MIC"}
        </Text>
      </TouchableOpacity>

      <Text
        style={{
          marginTop: 30,
          fontSize: 16,
        }}
      >
        {recording
          ? "Recording..."
          : "Tap microphone to ask a question"}
      </Text>
    </View>
  );
}
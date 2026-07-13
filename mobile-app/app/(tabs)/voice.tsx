import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { Audio } from "expo-av";

import { useMobileStore } from "../../store/useMobileStore";

export default function VoiceScreen() {
  const { voiceQuery } = useMobileStore();
  const [recording, setRecording] =
    useState<Audio.Recording | null>(null);

  const [isRecording, setIsRecording] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [answer, setAnswer] = useState("");
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  // Clean up sound on unmount
  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  async function startRecording() {
    try {
      setTranscription("");
      setAnswer("");
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
      console.log("Error starting recording:", err);
    }
  }

  async function stopRecording() {
    if (!recording) return;

    setIsRecording(false);
    setLoading(true);
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);

      if (!uri) {
        throw new Error("No recording URI found");
      }

      // Convert local audio file to Base64 using pure JS fetch/blob/reader
      const response = await fetch(uri);
      const blob = await response.blob();
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          const base64 = result.split(",")[1] || result;
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      // Submit base64 audio to the backend voice query API via Zustand store
      const result = await voiceQuery(base64Data, "en-IN");
      setTranscription(result.transcript || "");
      setAnswer(result.answer || "");

      // If synthesized audio is returned in the response, decode and play it back
      if (result.audioBase64) {
        if (sound) {
          await sound.unloadAsync();
        }

        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
          shouldRouteThroughEarpieceAndroid: false,
        });

        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: `data:audio/x-wav;base64,${result.audioBase64}` },
          { shouldPlay: true }
        );
        setSound(newSound);
      }
    } catch (err) {
      console.error("Error processing recording:", err);
      alert("Failed to process recording");
    } finally {
      setLoading(false);
    }
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
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
        disabled={loading}
        style={{
          width: 150,
          height: 150,
          borderRadius: 75,
          backgroundColor: isRecording
            ? "#dc2626"
            : loading
            ? "#9ca3af"
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
          {isRecording ? "STOP" : loading ? "..." : "MIC"}
        </Text>
      </TouchableOpacity>

      <Text style={{ marginTop: 20, color: "#6b7280" }}>
        {isRecording
          ? "Recording... Tap STOP to send"
          : loading
          ? "Processing audio query..."
          : "Tap microphone to ask a question"}
      </Text>

      {(transcription || answer) && (
        <View style={{ marginTop: 40, width: "100%", paddingHorizontal: 16 }}>
          {transcription ? (
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontWeight: "700", fontSize: 14, color: "#4b5563" }}>
                You said:
              </Text>
              <Text style={{ fontSize: 16, marginTop: 4, fontStyle: "italic" }}>
                "{transcription}"
              </Text>
            </View>
          ) : null}

          {answer ? (
            <View
              style={{
                backgroundColor: "#eff6ff",
                padding: 16,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: "#bfdbfe",
              }}
            >
              <Text style={{ fontWeight: "700", fontSize: 14, color: "#1e40af" }}>
                Answer:
              </Text>
              <Text style={{ fontSize: 16, marginTop: 6, color: "#1e3a8a" }}>
                {answer}
              </Text>
            </View>
          ) : null}
        </View>
      )}
    </View>
  );
}
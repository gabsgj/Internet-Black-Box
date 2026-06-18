import { View, Text } from "react-native";

export default function TimelineCard({ item }: any) {
  return (
    <View
      style={{
        backgroundColor: "white",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#e5e7eb",
      }}
    >
      <Text
        style={{
          fontSize: 12,
          color: "#6b7280",
          marginBottom: 4,
        }}
      >
        {item.timestamp}
      </Text>

      <Text
        style={{
          fontWeight: "600",
          marginBottom: 4,
        }}
      >
        {item.source}
      </Text>

      <Text
        style={{
          color: "#2563eb",
          marginBottom: 8,
        }}
      >
        {item.type}
      </Text>

      <Text>{item.content}</Text>
    </View>
  );
}
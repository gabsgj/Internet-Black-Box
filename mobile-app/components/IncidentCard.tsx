import {
  View,
  Text,
  TouchableOpacity,
} from "react-native";

import SeverityBadge from "./SeverityBadge";

export default function IncidentCard({
  incident,
  onPress,
}: any) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View
        style={{
          backgroundColor: "white",
          padding: 16,
          marginBottom: 12,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: "#e5e7eb",
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "600",
          }}
        >
          {incident.title}
        </Text>

        <Text
          style={{
            color: "#6b7280",
            marginTop: 8,
          }}
        >
          {incident.summary}
        </Text>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 12,
          }}
        >
          <SeverityBadge
            severity={incident.severity}
          />

          <Text>{incident.status}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
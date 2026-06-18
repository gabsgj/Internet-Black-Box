import {
  View,
  Text,
  FlatList,
  ScrollView,
} from "react-native";

import { timeline } from "../../mock/timeline";
import TimelineCard from "../../components/TimelineCard";
import { useMobileStore } from "../../store/useMobileStore";

export default function IncidentDetail() {
    const { selectedIncident } =
    useMobileStore();

  return (
    <ScrollView
      style={{
        flex: 1,
        padding: 16,
      }}
    >
      <Text
        style={{
          fontSize: 24,
          fontWeight: "700",
          marginBottom: 8,
        }}
      >
        {selectedIncident?.title}
      </Text>

      <Text
        style={{
          color: "#6b7280",
          marginBottom: 20,
        }}
      >
        {selectedIncident?.summary}
      </Text>

      <Text
        style={{
          fontSize: 18,
          fontWeight: "600",
          marginBottom: 16,
        }}
      >
        Causal Timeline
      </Text>

      {timeline.map((item) => (
        <TimelineCard
          key={item.id}
          item={item}
        />
      ))}

      <View
        style={{
          backgroundColor: "#fef2f2",
          padding: 16,
          borderRadius: 12,
          marginTop: 12,
        }}
      >
        <Text
          style={{
            fontWeight: "700",
            color: "#dc2626",
            marginBottom: 8,
          }}
        >
          Root Cause
        </Text>

        <Text>
          Auth validation update introduced
          backward token validation failure.
        </Text>
      </View>
    </ScrollView>
  );
}
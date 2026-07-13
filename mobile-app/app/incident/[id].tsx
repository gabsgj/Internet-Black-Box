import {
  View,
  Text,
  ScrollView,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useEffect } from "react";

import TimelineCard from "../../components/TimelineCard";
import { useMobileStore } from "../../store/useMobileStore";

export default function IncidentDetail() {
  const { id } = useLocalSearchParams();
  const {
    selectedIncident,
    setSelectedIncident,
    fetchIncidents,
    timeline,
    fetchIncidentTimeline,
  } = useMobileStore();

  useEffect(() => {
    if (id) {
      fetchIncidentTimeline(id as string).catch((err) => console.error(err));
      if (!selectedIncident || selectedIncident.id !== id) {
        fetchIncidents()
          .then((list) => {
            const found = list.find((inc: any) => inc.id === id);
            if (found) {
              setSelectedIncident(found);
            }
          })
          .catch((err) => console.error(err));
      }
    }
  }, [id]);

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
        {selectedIncident?.type} • Status: {selectedIncident?.status}
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

      {timeline && timeline.length > 0 ? (
        timeline.map((item: any) => (
          <TimelineCard
            key={item.id}
            item={item}
          />
        ))
      ) : (
        <Text style={{ color: "#6b7280", marginBottom: 16 }}>
          No timeline events available.
        </Text>
      )}

      <View
        style={{
          backgroundColor: "#fef2f2",
          padding: 16,
          borderRadius: 12,
          marginTop: 12,
          marginBottom: 24,
        }}
      >
        <Text
          style={{
            fontWeight: "700",
            color: "#dc2626",
            marginBottom: 8,
          }}
        >
          Root Cause / Summary
        </Text>

        <Text>
          {selectedIncident?.description ||
            "No AI reconstruction report generated yet."}
        </Text>
      </View>
    </ScrollView>
  );
}
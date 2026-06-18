import { View, Text } from "react-native";

interface Props {
  severity: string;
}

export default function SeverityBadge({
  severity,
}: Props) {
  const backgroundColor =
    severity === "P1"
      ? "#dc2626"
      : severity === "P2"
      ? "#ea580c"
      : "#16a34a";

  return (
    <View
      style={{
        backgroundColor,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        alignSelf: "flex-start",
      }}
    >
      <Text
        style={{
          color: "white",
          fontWeight: "600",
        }}
      >
        {severity}
      </Text>
    </View>
  );
}
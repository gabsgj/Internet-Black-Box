import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Incidents"
        }}
      />

      <Tabs.Screen
        name="voice"
        options={{
          title: "Voice"
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile"
        }}
      />
    </Tabs>
  );
}
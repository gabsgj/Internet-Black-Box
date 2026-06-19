import {
  View,
  Text,
  TouchableOpacity,
} from "react-native";

import {
  saveToken,
  getToken,
  removeToken,
} from "../../services/auth";

import { registerForPushNotifications }
from "../../services/notifications";

export default function ProfileScreen() {
  async function handleSave() {
    await saveToken(
      "sample-jwt-token"
    );

    alert("Token saved");
  }

  async function handleGet() {
    const token =
      await getToken();

    alert(token || "No token");
  }

  async function handleDelete() {
    await removeToken();

    alert("Token removed");
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 20,
      }}
    >

      <TouchableOpacity
        onPress={registerForPushNotifications}
      >
        <Text>Enable Notifications</Text>
      </TouchableOpacity>

      <Text
        style={{
          fontSize: 22,
          fontWeight: "700",
        }}
      >
        Profile
      </Text>

      <TouchableOpacity
        onPress={handleSave}
      >
        <Text>Save Token</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleGet}
      >
        <Text>Get Token</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleDelete}
      >
        <Text>Delete Token</Text>
      </TouchableOpacity>
    </View>
  );
}
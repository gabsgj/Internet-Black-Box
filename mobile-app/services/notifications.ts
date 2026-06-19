import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

export async function registerForPushNotifications() {
  if (!Device.isDevice) {
    console.log("Must use physical device");
    return;
  }

  const { status: existingStatus } =
    await Notifications.getPermissionsAsync();

  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } =
      await Notifications.requestPermissionsAsync();

    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.log("Permission denied");
    return;
  }

  try {
  const token =
    await Notifications.getExpoPushTokenAsync();

  console.log(token.data);
  
  return token.data;
  } catch (error) {
    console.log(
      "Push token unavailable in Expo Go"
    );
  }

}
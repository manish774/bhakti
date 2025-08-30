import * as Haptics from "expo-haptics";
import { Platform, Vibration } from "react-native";
export const vibrate = () => {
  if (Platform.OS === "web") {
    if (navigator && navigator.vibrate) {
      navigator.vibrate(100);
    }
  } else {
    if (Haptics && Haptics.notificationAsync) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Vibration.vibrate(100);
    }
  }
};

import * as Haptics from "expo-haptics";
import { Platform, Vibration } from "react-native";

export class VibrationManager {
  // Check if vibration is supported
  static isSupported() {
    if (Platform.OS === "web") {
      return !!(navigator && navigator.vibrate);
    }
    return true; // Native platforms support vibration
  }

  // Basic vibration with custom duration
  static vibrate(duration = 100) {
    if (!this.isSupported()) return;

    if (Platform.OS === "web") {
      navigator.vibrate(duration);
    } else {
      if (Haptics && Haptics.notificationAsync) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        Vibration.vibrate(duration);
      }
    }
  }

  // Success vibration - light and pleasant
  static success() {
    if (Platform.OS === "web") {
      if (navigator && navigator.vibrate) {
        navigator.vibrate([50, 30, 50]);
      }
    } else {
      if (Haptics && Haptics.notificationAsync) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else {
        Vibration.vibrate([50, 30, 50]);
      }
    }
  }

  // Error vibration - more intense
  static error() {
    if (Platform.OS === "web") {
      if (navigator && navigator.vibrate) {
        navigator.vibrate([200, 100, 200]);
      }
    } else {
      if (Haptics && Haptics.notificationAsync) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      } else {
        Vibration.vibrate([200, 100, 200]);
      }
    }
  }

  // Warning vibration - medium intensity
  static warning() {
    if (Platform.OS === "web") {
      if (navigator && navigator.vibrate) {
        navigator.vibrate([100, 50, 100, 50, 100]);
      }
    } else {
      if (Haptics && Haptics.notificationAsync) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      } else {
        Vibration.vibrate([100, 50, 100, 50, 100]);
      }
    }
  }

  // Selection vibration - light tap for UI selections
  static selection() {
    if (Platform.OS === "web") {
      if (navigator && navigator.vibrate) {
        navigator.vibrate(25);
      }
    } else {
      if (Haptics && Haptics.selectionAsync) {
        Haptics.selectionAsync();
      } else {
        Vibration.vibrate(25);
      }
    }
  }

  // Impact vibrations with different intensities
  static lightImpact() {
    if (Platform.OS === "web") {
      if (navigator && navigator.vibrate) {
        navigator.vibrate(30);
      }
    } else {
      if (Haptics && Haptics.impactAsync) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } else {
        Vibration.vibrate(30);
      }
    }
  }

  static mediumImpact() {
    if (Platform.OS === "web") {
      if (navigator && navigator.vibrate) {
        navigator.vibrate(75);
      }
    } else {
      if (Haptics && Haptics.impactAsync) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } else {
        Vibration.vibrate(75);
      }
    }
  }

  static heavyImpact() {
    if (Platform.OS === "web") {
      if (navigator && navigator.vibrate) {
        navigator.vibrate(150);
      }
    } else {
      if (Haptics && Haptics.impactAsync) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      } else {
        Vibration.vibrate(150);
      }
    }
  }

  // Custom pattern vibrations
  static heartbeat() {
    const pattern = [100, 100, 100, 500, 100, 100, 100];

    if (Platform.OS === "web") {
      if (navigator && navigator.vibrate) {
        navigator.vibrate(pattern);
      }
    } else {
      Vibration.vibrate(pattern);
    }
  }

  static pulse() {
    const pattern = [50, 50, 50, 50, 50];

    if (Platform.OS === "web") {
      if (navigator && navigator.vibrate) {
        navigator.vibrate(pattern);
      }
    } else {
      Vibration.vibrate(pattern);
    }
  }

  static longPress() {
    if (Platform.OS === "web") {
      if (navigator && navigator.vibrate) {
        navigator.vibrate(300);
      }
    } else {
      if (Haptics && Haptics.impactAsync) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      } else {
        Vibration.vibrate(300);
      }
    }
  }

  // Notification patterns
  static notification() {
    const pattern = [200, 100, 50, 100, 200];

    if (Platform.OS === "web") {
      if (navigator && navigator.vibrate) {
        navigator.vibrate(pattern);
      }
    } else {
      Vibration.vibrate(pattern);
    }
  }

  static urgentNotification() {
    const pattern = [300, 200, 300, 200, 300];

    if (Platform.OS === "web") {
      if (navigator && navigator.vibrate) {
        navigator.vibrate(pattern);
      }
    } else {
      Vibration.vibrate(pattern);
    }
  }

  // Custom pattern creator
  static customPattern(pattern: any) {
    if (!Array.isArray(pattern)) {
      console.warn("Custom pattern must be an array");
      return;
    }

    if (Platform.OS === "web") {
      if (navigator && navigator.vibrate) {
        navigator.vibrate(pattern);
      }
    } else {
      Vibration.vibrate(pattern);
    }
  }

  // Stop all vibrations
  static stop() {
    if (Platform.OS === "web") {
      if (navigator && navigator.vibrate) {
        navigator.vibrate(0);
      }
    } else {
      Vibration.cancel();
    }
  }
}

// Usage examples:
// VibrationManager.success();
// VibrationManager.error();
// VibrationManager.lightImpact();
// VibrationManager.heartbeat();
// VibrationManager.customPattern([100, 50, 100, 50, 200]);
// VibrationManager.stop();

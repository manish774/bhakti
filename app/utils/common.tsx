import { useRef, useState } from "react";
import { Animated } from "react-native";

// Reusable toast hook for showing transient messages with animation
export function useToast() {
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const toastAnim = useRef(new Animated.Value(0)).current;

  const showToast = (message: string) => {
    setToastMessage(message);
    setToastVisible(true);
    Animated.timing(toastAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      // hide after 2s
      setTimeout(() => {
        Animated.timing(toastAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }).start(() => setToastVisible(false));
      }, 2000);
    });
  };

  return {
    toastVisible,
    toastMessage,
    toastAnim,
    showToast,
    setToastVisible,
    setToastMessage,
  } as const;
}

export default useToast;

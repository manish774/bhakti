import { Platform } from "react-native";

export const isWeb = () => {
  return Platform.OS === "web";
};

export const isMobile = () => {
  return Platform.OS === "android" || Platform.OS === "ios";
};

// Neumorphic style system for React Native
import { StyleSheet } from "react-native";

export interface NeumorphTheme {
  isDark?: boolean;
  background?: string;
  accent?: string;
  text?: string;
}

export const getNeumorphStyles = (theme: NeumorphTheme) => {
  const isDark = theme?.isDark || false;
  // Use neumorphism.io recommended colors and shadow values
  const background = theme?.background || (isDark ? "#232946" : "#e0e0e0");
  const shadowLight = isDark ? "#2a2d3e" : "#ffffff";
  const shadowDark = isDark ? "#171a2b" : "#bebebe";
  const accent = theme?.accent || (isDark ? "#4f5d75" : "#b8c6db");

  return StyleSheet.create({
    container: {
      backgroundColor: background,
      flex: 1,
    },
    neumorph: {
      backgroundColor: background,
      borderRadius: 50,
      // Neumorphism.io recommended shadow
      shadowColor: shadowDark,
      shadowOffset: { width: 20, height: 20 },
      shadowOpacity: 0.6,
      shadowRadius: 60,
      elevation: 16,
      // Remove border color, use only shadow
    },
    neumorphInset: {
      backgroundColor: background,
      borderRadius: 50,
      shadowColor: shadowLight,
      shadowOffset: { width: -20, height: -20 },
      shadowOpacity: 0.8,
      shadowRadius: 60,
      elevation: 12,
    },
    button: {
      backgroundColor: background,
      borderRadius: 50,
      padding: 18,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: shadowDark,
      shadowOffset: { width: 20, height: 20 },
      shadowOpacity: 0.5,
      shadowRadius: 60,
      elevation: 12,
    },
    buttonActive: {
      backgroundColor: accent,
      borderRadius: 50,
      padding: 18,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: shadowLight,
      shadowOffset: { width: -20, height: -20 },
      shadowOpacity: 0.7,
      shadowRadius: 60,
      elevation: 12,
    },
    card: {
      backgroundColor: background,
      borderRadius: 50,
      padding: 24,
      marginVertical: 12,
      shadowColor: shadowDark,
      shadowOffset: { width: 20, height: 20 },
      shadowOpacity: 0.4,
      shadowRadius: 60,
      elevation: 16,
    },
    text: {
      color: theme?.text || (isDark ? "#e0e5ec" : "#232946"),
      fontSize: 18,
    },
    title: {
      color: theme?.text || (isDark ? "#e0e5ec" : "#232946"),
      fontSize: 24,
      fontWeight: "bold",
    },
    slider: {
      height: 8,
      borderRadius: 4,
      backgroundColor: accent,
      marginVertical: 18,
      // No border, only shadow
      shadowColor: shadowDark,
      shadowOffset: { width: 8, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 8,
    },
    imageCircle: {
      width: 140,
      height: 140,
      borderRadius: 70,
      backgroundColor: background,
      shadowColor: shadowDark,
      shadowOffset: { width: 20, height: 20 },
      shadowOpacity: 0.5,
      shadowRadius: 60,
      elevation: 16,
      alignItems: "center",
      justifyContent: "center",
    },
  });
};

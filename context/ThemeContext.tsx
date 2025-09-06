// ThemeContext.js
import { colorCombinations } from "@/constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({
  theme: colorCombinations[0],
  switchTheme: (_themeName: string) => {},
});

export const ThemeProvider = ({ children }: { children: any }) => {
  const STORAGE_KEY = "APP_THEME_NAME";
  // pick default theme (use the recommended one if available)
  const defaultTheme =
    colorCombinations.find((t) => t.recommended) || colorCombinations[0];
  const [theme, setTheme] = useState(defaultTheme);

  const switchTheme = (themeName: string) => {
    const newTheme = colorCombinations.find((t) => t.name === themeName);
    if (newTheme) setTheme(newTheme);
    // persist selection
    (async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, themeName);
      } catch (e) {
        console.warn("Failed to save theme to storage", e);
      }
    })();
  };

  // load saved theme on mount
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          const savedTheme = colorCombinations.find((t) => t.name === saved);
          if (savedTheme) setTheme(savedTheme);
        }
      } catch (e) {
        // ignore loading errors, keep default theme
        console.warn("Failed to load theme from storage", e);
      }
    })();
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, switchTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

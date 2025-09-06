import { colorCombinations } from "@/constants/Colors";
import { useTheme } from "@/context/ThemeContext";
import { VibrationManager } from "@/utils/Vibrate";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width: screenWidth } = Dimensions.get("window");
const isWeb = Platform.OS === "web";
export default function SettingsScreen() {
  const { switchTheme, theme } = useTheme();
  const themeIndexByname = colorCombinations.findIndex(
    (x) => x.name === theme.name
  );
  const [selectedTheme, setSelectedTheme] = useState(themeIndexByname); // Default to Warm Ember (recommended)

  // keep selectedTheme in sync if theme is loaded/changed elsewhere (persisted load)
  useEffect(() => {
    setSelectedTheme(themeIndexByname);
  }, [themeIndexByname]);

  // Toast state + animation
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

  const handleThemeSelect = (index: number) => {
    setSelectedTheme(index);

    VibrationManager.lightImpact();
  };

  const numColumns = isWeb ? 3 : 2;
  const itemWidth = (screenWidth - 60) / numColumns - 10;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colorCombinations[selectedTheme].background },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text
          style={[
            styles.headerTitle,
            { color: colorCombinations[selectedTheme].text },
          ]}
        >
          Choose Your Theme
        </Text>
        <Text
          style={[
            styles.headerSubtitle,
            { color: colorCombinations[selectedTheme].text },
          ]}
        >
          Select a color scheme for your spiritual journey
        </Text>
      </View>

      {/* Preview Card */}
      <View
        style={[
          styles.previewCard,
          {
            backgroundColor: colorCombinations[selectedTheme].card,
            borderColor: colorCombinations[selectedTheme].cardBorder,
          },
        ]}
      >
        <Text
          style={[
            styles.previewTitle,
            { color: colorCombinations[selectedTheme].text },
          ]}
        >
          {colorCombinations[selectedTheme].emoji}{" "}
          {colorCombinations[selectedTheme].name}
        </Text>
        <View style={styles.previewColorRow}>
          <View
            style={[
              styles.colorSwatch,
              { backgroundColor: colorCombinations[selectedTheme].button },
            ]}
          />
          <View
            style={[
              styles.colorSwatch,
              { backgroundColor: colorCombinations[selectedTheme].accent },
            ]}
          />
          <View
            style={[
              styles.colorSwatch,
              { backgroundColor: colorCombinations[selectedTheme].background },
            ]}
          />
        </View>
        <View
          style={[
            styles.previewButton,
            { backgroundColor: colorCombinations[selectedTheme].button },
          ]}
        >
          <Text
            style={[
              styles.previewButtonText,
              { color: colorCombinations[selectedTheme].buttonText },
            ]}
          >
            Preview Button
          </Text>
        </View>
      </View>

      {/* Color Grid */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.gridContainer}>
          {colorCombinations.map((theme, index) => (
            <Pressable
              key={index}
              style={[
                styles.themeItem,
                {
                  width: itemWidth,
                  backgroundColor: theme.background,
                  borderColor: theme.cardBorder,
                  borderWidth: selectedTheme === index ? 3 : 2,
                },
                selectedTheme === index && styles.selectedTheme,
              ]}
              onPress={() => handleThemeSelect(index)}
              android_ripple={{ color: theme.button + "20" }}
            >
              {/* Recommended Badge */}
              {theme.recommended && (
                <View
                  style={[
                    styles.recommendedBadge,
                    { backgroundColor: theme.accent },
                  ]}
                >
                  <Text style={styles.recommendedText}>✨</Text>
                </View>
              )}

              {/* Selection Indicator */}
              {selectedTheme === index && (
                <View
                  style={[
                    styles.selectedIndicator,
                    { backgroundColor: theme.button },
                  ]}
                >
                  <Text style={styles.selectedIcon}>✓</Text>
                </View>
              )}

              {/* Theme Content */}
              <Text style={styles.themeEmoji}>{theme.emoji}</Text>
              <Text
                style={[styles.themeName, { color: theme.text }]}
                numberOfLines={2}
              >
                {theme.name}
              </Text>

              {/* Color Preview Dots */}
              <View style={styles.colorDots}>
                <View
                  style={[styles.colorDot, { backgroundColor: theme.button }]}
                />
                <View
                  style={[styles.colorDot, { backgroundColor: theme.accent }]}
                />
                <View
                  style={[
                    styles.colorDot,
                    { backgroundColor: theme.cardBorder },
                  ]}
                />
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      {/* Toast */}
      {toastVisible && (
        <Animated.View
          style={[
            styles.toastContainer,
            {
              transform: [
                {
                  translateY: toastAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [40, 0],
                  }),
                },
              ],
              opacity: toastAnim,
            },
          ]}
        >
          <Text style={styles.toastText}>{toastMessage}</Text>
        </Animated.View>
      )}

      {/* Apply Button */}
      <View style={styles.bottomContainer}>
        <Pressable
          style={[
            styles.applyButton,
            { backgroundColor: colorCombinations[selectedTheme].button },
          ]}
          onPress={() => {
            // Apply theme logic here
            const name = colorCombinations[selectedTheme].name;

            switchTheme(name);
            VibrationManager.lightImpact();
            showToast(`${name} theme applied`);
          }}
        >
          <Text
            style={[
              styles.applyButtonText,
              { color: colorCombinations[selectedTheme].buttonText },
            ]}
          >
            Apply {colorCombinations[selectedTheme].name} Theme
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: isWeb ? 20 : 50,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 8,
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 16,
    opacity: 0.8,
    textAlign: "center",
    lineHeight: 22,
  },
  previewCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  previewTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
  },
  previewColorRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 16,
  },
  colorSwatch: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#00000020",
  },
  previewButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  previewButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
  },
  themeItem: {
    aspectRatio: 1,
    borderRadius: 20,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    position: "relative",
  },
  selectedTheme: {
    elevation: 6,
    shadowOpacity: 0.2,
    shadowRadius: 8,
    transform: [{ scale: 1.02 }],
  },
  recommendedBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
  },
  recommendedText: {
    fontSize: 12,
  },
  selectedIndicator: {
    position: "absolute",
    top: 8,
    left: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
  },
  selectedIcon: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "800",
  },
  themeEmoji: {
    fontSize: isWeb ? 32 : 28,
    marginBottom: 8,
  },
  themeName: {
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
    lineHeight: 18,
  },
  colorDots: {
    flexDirection: "row",
    gap: 4,
  },
  colorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: "#00000020",
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderTopWidth: 1,
    borderTopColor: "#00000010",
  },
  applyButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  applyButtonText: {
    fontSize: 18,
    fontWeight: "700",
  },
  toastContainer: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 90,
    backgroundColor: "#111",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
  },
  toastText: {
    color: "#fff",
    fontWeight: "600",
  },
});

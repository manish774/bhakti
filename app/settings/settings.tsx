import { colorCombinations } from "@/constants/Colors";
import { useTheme } from "@/context/ThemeContext";
import { VibrationManager } from "@/utils/Vibrate";
import React, { useEffect, useState } from "react";
import {
  Animated,
  Dimensions,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { useToast } from "../utils/common";

const { width: screenWidth } = Dimensions.get("window");
const isWeb = Platform.OS === "web";

export default function SettingsScreen() {
  const { switchTheme, theme } = useTheme();
  const themeIndexByname = colorCombinations.findIndex(
    (x) => x.name === theme.name
  );
  const [selectedTheme, setSelectedTheme] = useState(themeIndexByname);

  // Keep selectedTheme in sync if theme changes elsewhere
  useEffect(() => {
    setSelectedTheme(themeIndexByname);
  }, [themeIndexByname]);

  // Toast hook
  const { toastVisible, toastMessage, toastAnim, showToast } = useToast();

  const handleThemeSelect = (index: number) => {
    setSelectedTheme(index);
    VibrationManager.lightImpact();
  };

  const numColumns = isWeb ? 3 : 2;
  const itemWidth = 20;

  // Example toggles/settings
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // Expanded sections state
  const [expanded, setExpanded] = useState({
    privacy: false,
    terms: false,
    about: false,
  });

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colorCombinations[selectedTheme].background },
      ]}
    >
      <ScrollView
        contentContainerStyle={{ paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text
            style={[
              styles.headerTitle,
              { color: colorCombinations[selectedTheme].text },
            ]}
          >
            Settings
          </Text>
          <Text
            style={[
              styles.headerSubtitle,
              { color: colorCombinations[selectedTheme].text },
            ]}
          >
            Manage your preferences & account
          </Text>
        </View>

        {/* ============ THEME SECTION ============ */}
        <View style={styles.section}>
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
              Theme Preview
            </Text>
            <Text
              style={{
                marginBottom: 8,
                color: colorCombinations[selectedTheme].text,
              }}
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
                  {
                    backgroundColor:
                      colorCombinations[selectedTheme].background,
                  },
                ]}
              />
            </View>
          </View>

          {/* Theme Grid */}
          <View style={styles.gridContainer}>
            {colorCombinations.map((theme, index) => (
              <Pressable
                key={index}
                style={[
                  styles.themeItem,
                  {
                    width: itemWidth,
                    height: itemWidth,
                    backgroundColor: theme.background,
                    borderColor: theme.cardBorder,
                    borderWidth: selectedTheme === index ? 3 : 2,
                  },
                  selectedTheme === index && styles.selectedTheme,
                ]}
                onPress={() => handleThemeSelect(index)}
                android_ripple={{ color: theme.button + "20" }}
              >
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
              </Pressable>
            ))}
          </View>

          {/* Apply Button (inside scroll) */}
          <Pressable
            style={[
              styles.applyButton,
              { backgroundColor: colorCombinations[selectedTheme].button },
            ]}
            onPress={() => {
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

        {/* ============ GENERAL SETTINGS ============ */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General</Text>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Enable Notifications</Text>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
            />
          </View>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Dark Mode</Text>
            <Switch value={darkMode} onValueChange={setDarkMode} />
          </View>
        </View>

        {/* ============ INFO / LEGAL ============ */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About & Legal</Text>

          {/* Privacy Policy */}
          <Pressable
            style={styles.infoRow}
            onPress={() =>
              setExpanded((prev) => ({ ...prev, privacy: !prev.privacy }))
            }
          >
            <Text style={styles.infoText}>📜 Privacy Policy</Text>
          </Pressable>
          {expanded.privacy && (
            <View style={styles.expandedBox}>
              <Text style={styles.expandedText}>
                We respect your privacy. Your personal data will never be shared
                without consent. This section can be updated with your actual
                policy.
              </Text>
            </View>
          )}

          {/* Terms & Conditions */}
          <Pressable
            style={styles.infoRow}
            onPress={() =>
              setExpanded((prev) => ({ ...prev, terms: !prev.terms }))
            }
          >
            <Text style={styles.infoText}>⚖️ Terms & Conditions</Text>
          </Pressable>
          {expanded.terms && (
            <View style={styles.expandedBox}>
              <Text style={styles.expandedText}>
                By using this app, you agree to follow all guidelines and terms
                mentioned. Add detailed terms here.
              </Text>
            </View>
          )}

          <Pressable
            style={styles.infoRow}
            onPress={() =>
              setExpanded((prev) => ({ ...prev, about: !prev.about }))
            }
          >
            <Text style={styles.infoText}>ℹ️ About App</Text>
          </Pressable>
          {expanded.about && (
            <View style={styles.expandedBox}>
              <Text style={styles.expandedText}>
                This app helps you manage themes, preferences, and more. You can
                expand this section with version info, credits, etc.
              </Text>
            </View>
          )}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: isWeb ? 20 : 50 },
  header: { paddingHorizontal: 20, paddingBottom: 20, alignItems: "center" },
  headerTitle: { fontSize: 28, fontWeight: "800", marginBottom: 8 },
  headerSubtitle: { fontSize: 16, opacity: 0.8, textAlign: "center" },

  section: { marginTop: 24, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "700", marginBottom: 12 },

  previewCard: {
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: "center",
  },
  previewTitle: { fontSize: 20, fontWeight: "700", marginBottom: 8 },
  previewColorRow: { flexDirection: "row", gap: 8 },
  colorSwatch: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#00000020",
  },

  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  themeItem: {
    aspectRatio: 1,
    borderRadius: 50,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  selectedTheme: { transform: [{ scale: 1.02 }] },
  selectedIndicator: {
    position: "absolute",
    top: 8,
    left: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedIcon: { color: "#fff", fontSize: 14, fontWeight: "800" },

  applyButton: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 12,
  },
  applyButtonText: { fontSize: 18, fontWeight: "700" },

  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#00000010",
  },
  settingLabel: { fontSize: 16, fontWeight: "500" },

  infoRow: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#00000010",
  },
  infoText: { fontSize: 16 },

  expandedBox: {
    padding: 12,
    backgroundColor: "#00000005",
    borderRadius: 8,
    marginBottom: 8,
  },
  expandedText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },

  toastContainer: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 40,
    backgroundColor: "#111",
    padding: 12,
    borderRadius: 12,
  },
  toastText: { color: "#fff", fontWeight: "600" },
});

import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/UserContext";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
// import { ICorePujaType, PujaOption } from "../auth/utils";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  ICorePujaType,
  PujaOption,
  pujaOptions,
  RootStackParamList,
} from "../utils/utils";

type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

const { width } = Dimensions.get("window");

interface PujaTypeSelectorProps {
  onSelection?: (selectedType: ICorePujaType) => void;
}

const SelectCorePujaType: React.FC<PujaTypeSelectorProps> = ({
  onSelection,
}) => {
  const [selectedType, setSelectedType] = useState<ICorePujaType | null>(null);
  const { setCorePujaType, isLoggedIn, corePujaType } = useAuth();
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const navigation = useNavigation<NavigationProps>();

  const handlePress = (type: ICorePujaType): void => {
    setSelectedType(type);
  };

  useEffect(() => {
    if (navigation && typeof navigation.setOptions === "function") {
      navigation.setOptions({
        headerShown: false,
        title: pujaOptions?.find((puja) => puja.type === corePujaType)?.title,
      });
    }
  }, [navigation, corePujaType]);

  const handleConfirm = (): void => {
    if (selectedType) {
      onSelection?.(selectedType);
      setCorePujaType(selectedType);
      //router.push("/Home/Home");
      navigation.navigate("Home");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Choose Puja Type</Text>
          <Text style={styles.headerSubtitle}>
            Select the type of ceremony you prefer
          </Text>
        </View>

        {/* Options */}
        <View style={styles.optionsContainer}>
          {pujaOptions
            .filter((x) => x.visible)
            .map((option: PujaOption, index: number) => (
              <TouchableOpacity
                key={option.type}
                style={[
                  styles.optionCard,
                  {
                    borderColor:
                      selectedType === option.type
                        ? option.color
                        : "transparent",
                    borderWidth: selectedType === option.type ? 3 : 1,
                    opacity:
                      selectedType && selectedType !== option.type ? 0.7 : 1,
                    shadowColor:
                      selectedType === option.type
                        ? option.shadowColor
                        : "#000",
                  },
                ]}
                onPress={() => handlePress(option.type)}
                activeOpacity={0.8}
              >
                {/* Icon Circle */}
                <View
                  style={[styles.iconCircle, { backgroundColor: option.color }]}
                >
                  <Text style={styles.iconText}>{option.icon}</Text>
                </View>

                {/* Content */}
                <View style={styles.optionContent}>
                  <Text style={styles.optionTitle}>{option.title}</Text>
                  <Text style={styles.optionDescription}>
                    {option.description}
                  </Text>
                </View>

                {/* Selection Indicator */}
                <View
                  style={[
                    styles.selectionIndicator,
                    {
                      borderColor:
                        selectedType === option.type ? option.color : "#E8E8E8",
                    },
                  ]}
                >
                  {selectedType === option.type && (
                    <View
                      style={[
                        styles.selectedDot,
                        { backgroundColor: option.color },
                      ]}
                    />
                  )}
                </View>
              </TouchableOpacity>
            ))}
        </View>

        {/* Confirm Button */}
        <TouchableOpacity
          style={[
            styles.confirmButton,
            {
              opacity: selectedType ? 1 : 0.5,
              backgroundColor: selectedType ? theme.accent : "#CCCCCC",
            },
          ]}
          onPress={handleConfirm}
          disabled={!selectedType}
          activeOpacity={selectedType ? 0.8 : 1}
        >
          <Text style={styles.confirmButtonText}>
            {selectedType
              ? "Continue with Selection"
              : "Please Select an Option"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    safeArea: {
      backgroundColor: "#F8F9FA",
    },
    container: {
      marginTop: 10,
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: "flex-end", // content starts from bottom
      paddingHorizontal: 20,
      paddingTop: 20, // give gap at top
      paddingBottom: 0,
    },
    header: {
      alignItems: "center",
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: "#2C3E50",
      marginBottom: 8,
      textAlign: "center",
    },
    headerSubtitle: {
      fontSize: 16,
      color: "#7F8C8D",
      textAlign: "center",
      paddingHorizontal: 20,
    },
    optionsContainer: {
      flex: 1,
      justifyContent: "center",
      marginVertical: 5,
    },
    optionCard: {
      backgroundColor: "white",
      marginVertical: 12,
      borderRadius: 20,
      flexDirection: "row",
      alignItems: "center",
      padding: 15,
      borderWidth: 1,
      borderColor: "#E8E8E8",
      // iOS Shadow
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      // Android Shadow
      elevation: 4,
    },
    iconCircle: {
      width: 45,
      height: 45,
      borderRadius: 30,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 20,
    },
    iconText: {
      fontSize: 20,
    },
    optionContent: {
      flex: 1,
    },
    optionTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: "#2C3E50",
      marginBottom: 6,
    },
    optionDescription: {
      fontSize: 12,
      color: "#7F8C8D",
      lineHeight: 15,
    },
    selectionIndicator: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: "#E8E8E8",
      justifyContent: "center",
      alignItems: "center",
    },
    selectedDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
    },
    confirmButton: {
      backgroundColor: theme.background,
      paddingVertical: 18,
      borderRadius: 15,
      marginVertical: 30,
      // iOS Shadow
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      // Android Shadow
      elevation: 3,
    },
    confirmButtonText: {
      color: "white",
      textAlign: "center",
      fontSize: 18,
      fontWeight: "bold",
    },
    bottomDecoration: {
      alignItems: "center",
      marginTop: 10,
    },
    decorationText: {
      fontSize: 16,
      color: "#95A5A6",
      fontWeight: "500",
    },
  });

export default SelectCorePujaType;

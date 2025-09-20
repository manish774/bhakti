import { ICorePujaType, useAuth } from "@/context/UserContext";
import React, { useState } from "react";
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

const { width } = Dimensions.get("window");

interface PujaOption {
  type: ICorePujaType;
  title: string;
  description: string;
  icon: string;
  color: string;
  shadowColor: string;
  visible: boolean;
}

interface PujaTypeSelectorProps {
  onSelection?: (selectedType: ICorePujaType) => void;
}

const SelectCorePujaType: React.FC<PujaTypeSelectorProps> = ({
  onSelection,
}) => {
  const [selectedType, setSelectedType] = useState<ICorePujaType | null>(null);
  const { setCorePujaType } = useAuth();
  const pujaOptions: PujaOption[] = [
    {
      type: ICorePujaType.BOOK_PUJA,
      title: "Book Puja",
      description:
        "Personalized puja performed by a priest with your name & gotra. Includes mantra chanting and a recorded video.",
      icon: "🙏",
      color: "#FF6B6B",
      shadowColor: "#FF6B6B",
      visible: true,
    },
    {
      type: ICorePujaType.BOOK_PRASAD,
      title: "Book Prasad",
      description:
        "Get sacred prasad offered during a puja, packed and delivered with divine blessings.",
      icon: "🍯",
      color: "#4ECDC4",
      shadowColor: "#4ECDC4",
      visible: true,
    },
    {
      type: ICorePujaType.BOOK_PUJA_SAMAGRI,
      title: "Book Puja Samagri",
      description:
        "Order a complete puja samagri kit that includes all essential ritual items like incense, diya, kumkum, rice, and flowers. Ideal for performing your own puja at home.",
      icon: "✨",
      color: "#45B7D1",
      shadowColor: "#45B7D1",
      visible: false,
    },
    {
      type: ICorePujaType.BOOK_OFFLINE_PUJA,
      title: "Book Offline Puja",
      description:
        "Schedule a priest to perform a full traditional puja at your home or venue.",
      icon: "🏠",
      color: "#FFA500",
      shadowColor: "#FFA500",
      visible: true,
    },
  ];

  const handlePress = (type: ICorePujaType): void => {
    setSelectedType(type);
  };

  const handleConfirm = (): void => {
    if (selectedType) {
      onSelection?.(selectedType);
      setCorePujaType(selectedType);
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
              backgroundColor: selectedType ? "#2E7D32" : "#CCCCCC",
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

        {/* Bottom Decoration */}
        <View style={styles.bottomDecoration}>
          <Text style={styles.decorationText}>Make you choise </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
    paddingTop: 20,
  },
  headerTitle: {
    fontSize: 28,
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
    marginVertical: 20,
  },
  optionCard: {
    backgroundColor: "white",
    marginVertical: 12,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    padding: 24,
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
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
  },
  iconText: {
    fontSize: 24,
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
    backgroundColor: "#2E7D32",
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
    marginTop: 20,
  },
  decorationText: {
    fontSize: 16,
    color: "#95A5A6",
    fontWeight: "500",
  },
});

export default SelectCorePujaType;

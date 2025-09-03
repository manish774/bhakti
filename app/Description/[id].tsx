import { BhaktiColors } from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Button, Chip, Divider, Text } from "react-native-paper";
import rawJson from "../Data/raw.json";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const isWeb = Platform.OS === "web";
const maxWidth = isWeb ? 800 : screenWidth;

export default function Description() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const idParam = params.id as string | undefined;
  const [selectedDevoteeType, setSelectedDevoteeType] = useState<number>(1);
  const [popularDevoteeType, setPopularDevoteeType] = useState<number>(2);

  const item = rawJson.data.find((d: any) => String(d.id) === String(idParam));

  const openWhatsApp = () => {
    const phoneNumber = "919031440979"; // India country code + your number
    const packageType =
      selectedDevoteeType === 1
        ? "Single Devotee"
        : selectedDevoteeType === 2
        ? "Two Devotees"
        : "Four Devotees";

    const message = `Hi Prayer, you have selected package for ${packageType} for ${item?.temple?.name} temple puja`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `whatsapp://send?phone=${phoneNumber}&text=${encodedMessage}`;
    const webWhatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    // Try to open WhatsApp app first, fallback to web version
    Linking.canOpenURL(whatsappUrl)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(whatsappUrl);
        } else {
          return Linking.openURL(webWhatsappUrl);
        }
      })
      .catch((err) => {
        console.error("An error occurred", err);
        // Fallback to web version
        Linking.openURL(webWhatsappUrl);
      });
  };

  if (!item) {
    return (
      <View style={styles.errorContainer}>
        <LinearGradient
          colors={[BhaktiColors.background, BhaktiColors.card]}
          style={styles.errorGradient}
        >
          <View style={styles.errorContent}>
            <Text style={styles.errorEmoji}>🔍</Text>
            <Text variant="headlineSmall" style={styles.errorTitle}>
              Puja Not Found
            </Text>
            <Text style={styles.errorText}>
              The spiritual journey you are seeking is not available right now.
            </Text>
            <Button
              mode="contained"
              onPress={() => router.push("/")}
              style={styles.errorButton}
              labelStyle={styles.errorButtonText}
            >
              Explore Other Pujas
            </Button>
          </View>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.mainContainer}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Header with Gradient */}
        <LinearGradient
          colors={[BhaktiColors.background, BhaktiColors.card]}
          style={styles.headerGradient}
        >
          {item.temple.image ? (
            <View style={styles.imageContainer}>
              <Image
                source={
                  typeof item.temple.image === "string"
                    ? { uri: item.temple.image }
                    : item.temple.image
                }
                style={styles.heroImage}
                resizeMode="cover"
              />
            </View>
          ) : (
            <View style={styles.placeholderContainer}>
              <Text style={styles.placeholderIcon}>🏛️</Text>
            </View>
          )}
        </LinearGradient>

        {/* Main Content Card */}
        <View style={styles.contentCard}>
          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text variant="headlineLarge" style={styles.mainTitle}>
              {item.title}
            </Text>
            <View style={styles.templeInfoRow}>
              <Text variant="titleMedium" style={styles.templeName}>
                {item.temple.name}
              </Text>
              <Chip
                icon="map-marker"
                style={styles.locationChip}
                textStyle={styles.locationChipText}
              >
                {item.temple.location}
              </Chip>
            </View>
          </View>

          <Divider style={styles.sectionDivider} />

          {/* Quick Info Cards */}
          <View style={styles.quickInfoSection}>
            <View style={styles.infoGrid}>
              <View style={styles.infoCard}>
                <Text style={styles.infoIcon}>🗓️</Text>
                <Text style={styles.infoLabel}>Last Date</Text>
                <Text style={styles.infoValue}>{item.lastDate}</Text>
              </View>

              <View style={styles.infoCard}>
                <Text style={styles.infoIcon}>💰</Text>
                <Text style={styles.infoLabel}>Starting From</Text>
                <Text style={styles.infoValue}>
                  ₹{item.temple.price.oneDevotee.toLocaleString("en-IN")}
                </Text>
              </View>

              <View style={styles.infoCard}>
                <Text style={styles.infoIcon}>📦</Text>
                <Text style={styles.infoLabel}>Prasad</Text>
                <Text style={styles.infoValue}>
                  {item.temple.prasadDelivery?.included
                    ? "Included"
                    : "Not Included"}
                </Text>
              </View>
            </View>
          </View>

          <Divider style={styles.sectionDivider} />

          {/* Description Section */}
          <View style={styles.section}>
            <Text variant="titleLarge" style={styles.sectionHeader}>
              ✨ About This Sacred Ritual
            </Text>
            <View style={styles.descriptionCard}>
              <Text style={styles.descriptionText}>
                {item.description.point1}
              </Text>
              <Text style={styles.descriptionText}>
                {item.description.point2}
              </Text>
            </View>
          </View>

          {/* Pricing Section */}
          <View style={styles.section}>
            <Text variant="titleLarge" style={styles.sectionHeader}>
              Choose Your Plans
            </Text>
            <View style={styles.pricingContainer}>
              {[
                {
                  id: 1,
                  label: "Single Devotee",
                  price: item.temple.price.oneDevotee,
                  subtitle: "Perfect for individual prayers",
                },
                {
                  id: 2,
                  label: "Two Devotees",
                  price: item.temple.price.twoDevotees,
                  subtitle: "Ideal for couples",
                },
                {
                  id: 3,
                  label: "Four Devotees",
                  price: item.temple.price.fourDevotees,
                  subtitle: "Best for families",
                },
              ].map((plan, index) => (
                <Pressable
                  key={index}
                  style={[
                    styles.pricingCard,
                    plan.id === selectedDevoteeType && styles.recommendedCard,
                  ]}
                  onPress={() => {
                    setSelectedDevoteeType(plan.id);
                  }}
                >
                  {plan.id === popularDevoteeType && (
                    <View style={styles.recommendedBadge}>
                      <Text style={styles.recommendedText}>Most Popular</Text>
                    </View>
                  )}
                  <View style={styles.planLeft}>
                    <Text
                      style={[
                        styles.planName,
                        plan.id === selectedDevoteeType &&
                          styles.recommendedPlanName,
                      ]}
                    >
                      {plan.label}
                    </Text>
                    <Text
                      style={[
                        styles.planSubtitle,
                        plan.id === selectedDevoteeType &&
                          styles.recommendedPlanSubtitle,
                      ]}
                    >
                      {plan.subtitle}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.planPrice,
                      plan.id === selectedDevoteeType &&
                        styles.recommendedPrice,
                    ]}
                  >
                    ₹{plan.price.toLocaleString("en-IN")}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Pandit Section */}
          <View style={styles.section}>
            <Text variant="titleLarge" style={styles.sectionHeader}>
              🧘‍♂️ Your Spiritual Guide
            </Text>
            <View style={styles.panditCard}>
              <View style={styles.panditHeader}>
                <View style={styles.panditAvatar}>
                  <Text style={styles.panditAvatarText}>🙏</Text>
                </View>
                <View style={styles.panditInfo}>
                  <Text style={styles.panditName}>
                    {item.temple.pandit.name}
                  </Text>
                  <Text style={styles.panditExperience}>
                    Experienced Temple Priest
                  </Text>
                </View>
              </View>
              <Text style={styles.panditDescription}>
                {item.temple.pandit.about}
              </Text>
            </View>
          </View>

          {/* Prasad Delivery Info */}
          {item.temple.prasadDelivery?.included && (
            <View style={styles.section}>
              <Text variant="titleLarge" style={styles.sectionHeader}>
                🎁 Prasad Delivery
              </Text>
              <View style={styles.deliveryCard}>
                <View style={styles.deliveryRow}>
                  <View style={styles.deliveryItem}>
                    <Text style={styles.deliveryIcon}>✅</Text>
                    <View>
                      <Text style={styles.deliveryLabel}>Prasad Included</Text>
                      <Text style={styles.deliverySubtext}>
                        Sacred offerings from the temple
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.deliveryRow}>
                  <View style={styles.deliveryItem}>
                    <Text style={styles.deliveryIcon}>🚚</Text>
                    <View>
                      <Text style={styles.deliveryLabel}>Delivery Time</Text>
                      <Text style={styles.deliverySubtext}>
                        {item.temple.prasadDelivery.deliveryTime}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* Spacer to prevent content from being hidden behind fixed button */}
          <View style={styles.bottomSpacer} />
        </View>
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View>
        <Button
          mode="contained"
          onPress={openWhatsApp}
          style={styles.fixedBookButton}
          contentStyle={styles.fixedButtonContent}
          labelStyle={styles.fixedBookButtonText}
        >
          Book This Puja
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: BhaktiColors.background,
  },
  scrollView: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    alignItems: "center",
  },

  // Header Section
  headerGradient: {
    width: "100%",
    maxWidth,
    height: isWeb ? 320 : 280,
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    width: "90%",
    height: "80%",
    borderRadius: 20,
    overflow: "hidden",
    elevation: 8,
    shadowColor: BhaktiColors.text,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    borderWidth: 3,
    borderColor: BhaktiColors.cardBorder,
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  placeholderContainer: {
    width: "90%",
    height: "80%",
    backgroundColor: BhaktiColors.card,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: BhaktiColors.cardBorder,
  },
  placeholderIcon: {
    fontSize: 80,
    opacity: 0.5,
  },

  // Content Card
  contentCard: {
    width: "100%",
    maxWidth,
    backgroundColor: BhaktiColors.card,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -32,
    paddingTop: 32,
    paddingHorizontal: isWeb ? 40 : 20,
    paddingBottom: 32,
    elevation: 8,
    shadowColor: BhaktiColors.text,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    borderWidth: 2,
    borderColor: BhaktiColors.cardBorder,
  },

  // Title Section
  titleSection: {
    alignItems: "center",
    marginBottom: 24,
  },
  mainTitle: {
    fontWeight: "800",
    color: BhaktiColors.text,
    textAlign: "center",
    marginBottom: 16,
    lineHeight: isWeb ? 42 : 36,
  },
  templeInfoRow: {
    alignItems: "center",
    gap: 12,
  },
  templeName: {
    fontWeight: "600",
    color: BhaktiColors.text,
    textAlign: "center",
    marginBottom: 8,
  },
  locationChip: {
    backgroundColor: BhaktiColors.button,
    borderColor: BhaktiColors.accent,
    borderWidth: 1,
    elevation: 2,
  },
  locationChipText: {
    color: BhaktiColors.buttonText,
    fontWeight: "600",
  },

  // Quick Info Section
  quickInfoSection: {
    marginBottom: 24,
  },
  infoGrid: {
    flexDirection: isWeb ? "row" : "row",
    justifyContent: "space-around",
    gap: isWeb ? 24 : 12,
  },
  infoCard: {
    flex: 1,
    alignItems: "center",
    backgroundColor: BhaktiColors.background,
    padding: isWeb ? 20 : 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: BhaktiColors.cardBorder,
    minHeight: isWeb ? 120 : 100,
    justifyContent: "center",
    elevation: 3,
    shadowColor: BhaktiColors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoIcon: {
    fontSize: isWeb ? 28 : 24,
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 12,
    color: BhaktiColors.text,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 4,
    opacity: 0.8,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: "700",
    color: BhaktiColors.text,
    textAlign: "center",
  },

  // Sections
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    fontWeight: "700",
    color: BhaktiColors.text,
    marginBottom: 16,
    textAlign: isWeb ? "left" : "center",
  },
  sectionDivider: {
    backgroundColor: BhaktiColors.cardBorder,
    height: 2,
    marginVertical: 24,
    borderRadius: 1,
  },

  // Description
  descriptionCard: {
    backgroundColor: BhaktiColors.background,
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: BhaktiColors.cardBorder,
    elevation: 2,
    shadowColor: BhaktiColors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 26,
    color: BhaktiColors.text,
    marginBottom: 16,
    textAlign: "justify",
  },

  // Pricing
  pricingContainer: {
    gap: 12,
  },
  pricingCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: BhaktiColors.background,
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: BhaktiColors.cardBorder,
    elevation: 2,
    shadowColor: BhaktiColors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  recommendedCard: {
    backgroundColor: BhaktiColors.button,
    borderColor: BhaktiColors.accent,
    borderWidth: 3,
    position: "relative",
    elevation: 4,
    shadowOpacity: 0.2,
  },
  recommendedBadge: {
    position: "absolute",
    top: -8,
    right: 16,
    backgroundColor: BhaktiColors.accent,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    elevation: 2,
  },
  recommendedText: {
    color: BhaktiColors.buttonText,
    fontSize: 12,
    fontWeight: "700",
  },
  planLeft: {
    flex: 1,
  },
  planName: {
    fontSize: 18,
    fontWeight: "700",
    color: BhaktiColors.text,
    marginBottom: 4,
  },
  recommendedPlanName: {
    color: BhaktiColors.buttonText,
  },
  planSubtitle: {
    fontSize: 13,
    color: BhaktiColors.text,
    fontWeight: "500",
    opacity: 0.8,
  },
  recommendedPlanSubtitle: {
    color: BhaktiColors.buttonText,
    opacity: 0.9,
  },
  planPrice: {
    fontSize: 22,
    fontWeight: "800",
    color: BhaktiColors.text,
  },
  recommendedPrice: {
    color: BhaktiColors.buttonText,
  },

  // Pandit Section
  panditCard: {
    backgroundColor: BhaktiColors.background,
    borderRadius: 20,
    padding: 24,
    borderWidth: 2,
    borderColor: BhaktiColors.cardBorder,
    elevation: 3,
    shadowColor: BhaktiColors.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  panditHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  panditAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: BhaktiColors.button,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    elevation: 4,
    shadowColor: BhaktiColors.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    borderWidth: 2,
    borderColor: BhaktiColors.accent,
  },
  panditAvatarText: {
    fontSize: 28,
    color: BhaktiColors.buttonText,
  },
  panditInfo: {
    flex: 1,
  },
  panditName: {
    fontSize: 20,
    fontWeight: "700",
    color: BhaktiColors.text,
    marginBottom: 4,
  },
  panditExperience: {
    fontSize: 14,
    color: BhaktiColors.text,
    fontWeight: "500",
    opacity: 0.8,
  },
  panditDescription: {
    fontSize: 15,
    lineHeight: 24,
    color: BhaktiColors.text,
  },

  // Delivery Section
  deliveryCard: {
    backgroundColor: BhaktiColors.background,
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: BhaktiColors.cardBorder,
    elevation: 2,
    shadowColor: BhaktiColors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  deliveryRow: {
    marginBottom: 16,
  },
  deliveryItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  deliveryIcon: {
    fontSize: 24,
  },
  deliveryLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: BhaktiColors.text,
    marginBottom: 4,
  },
  deliverySubtext: {
    fontSize: 14,
    color: BhaktiColors.text,
    opacity: 0.7,
  },

  // Bottom Spacer to prevent content from being hidden behind fixed button
  bottomSpacer: {
    height: 100, // Height of fixed button + padding
  },

  // Fixed Bottom Button
  fixedBottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: isWeb ? 16 : Platform.OS === "ios" ? 32 : 16, // Extra padding for iOS safe area
  },
  fixedBookButton: {
    backgroundColor: BhaktiColors.accent, // Saffron color
    borderRadius: 0,
    width: "100%",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  fixedButtonContent: {
    paddingVertical: 16,
  },
  fixedBookButtonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 18,
  },

  // Error States
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorGradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorContent: {
    backgroundColor: BhaktiColors.card,
    padding: 40,
    borderRadius: 24,
    alignItems: "center",
    maxWidth: 400,
    width: "100%",
    elevation: 8,
    shadowColor: BhaktiColors.text,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    borderWidth: 2,
    borderColor: BhaktiColors.cardBorder,
  },
  errorEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorTitle: {
    color: BhaktiColors.text,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  errorText: {
    color: BhaktiColors.text,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
    fontSize: 16,
    opacity: 0.8,
  },
  errorButton: {
    backgroundColor: BhaktiColors.button,
    borderRadius: 12,
    minWidth: 180,
    elevation: 4,
  },
  errorButtonText: {
    color: BhaktiColors.buttonText,
    fontWeight: "700",
    fontSize: 16,
  },
});

import ExpandablePlanSelector from "@/components/ExpandableSelector/ExpandableSelector";
import Model from "@/components/Model";
import { Core } from "@/serviceManager/ServiceManager";
import { VibrationManager } from "@/utils/Vibrate";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  Dimensions,
  Image,
  Platform,
  ScrollView,
  TextInput,
  View,
} from "react-native";
import { Button, Chip, Divider, Text } from "react-native-paper";
import { useTheme } from "../../context/ThemeContext";
import rawJson from "../Data/raw.json";
import { styles as createStyles } from "./Styles";
import { openWhatsApp } from "./utils";
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
const isWeb = Platform.OS === "web";
const maxWidth = isWeb ? 800 : screenWidth;
interface TemplePackage {
  id: string;
  name: string;
  description: string;
  price: number;
  isPopular?: boolean;
}
interface TempleData {
  packages: TemplePackage[];
  // ... other temple properties
}
export default function Description() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const idParam = params.id as string | undefined;
  const navigation: any = useNavigation();
  const [selectedDevoteeType, setSelectedDevoteeType] = useState<string>();
  // const [popularDevoteeType, setPopularDevoteeType] = useState<string>();
  const [showModel, setShowModel] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const [userPhone, setUserPhone] = useState<string>("");
  //alert(JSON.stringify(params));
  const item = rawJson.data.find((d: any) => d?.[Core.id] === idParam);
  const { theme } = useTheme();
  // Instantiate style sheet from factory with current theme, maxWidth and platform
  const styles = createStyles({ theme, maxWidth, platform: Platform });

  const transformedPlans = useMemo(() => {
    const packages = item?.[Core.Temple]?.packages;
    if (!packages || !Array.isArray(packages)) {
      return [];
    }

    return packages;
  }, [item]);

  useEffect(() => {
    if (navigation && typeof navigation.setOptions === "function") {
      navigation.setOptions({ title: "" });
    }
  }, [navigation]);

  const userForm = () => {
    return (
      <View>
        <TextInput
          value={userEmail}
          onChangeText={setUserEmail}
          keyboardType={"name-phone-pad"}
          placeholder={"Name"}
          placeholderTextColor={`${theme.text}99`}
          style={[
            styles.input,
            {
              backgroundColor: theme.card,
              color: theme.text,
              borderColor: theme.cardBorder,
              borderWidth: 1,
              padding: 12,
              borderRadius: 8,
            },
          ]}
        />
        <TextInput
          value={userPhone}
          onChangeText={setUserPhone}
          keyboardType={"number-pad"}
          placeholder={"Phone number"}
          placeholderTextColor={`${theme.text}99`}
          style={[
            styles.input,
            {
              backgroundColor: theme.card,
              color: theme.text,
              borderColor: theme.cardBorder,
              borderWidth: 1,
              padding: 12,
              borderRadius: 8,
            },
          ]}
        />

        <Button
          mode="contained"
          onPress={() => {
            openWhatsApp({
              name: userEmail,
              userPhone: userPhone,
              selectedDevoteeType,
              item,
            }); // Placeholder submit action — replace with real logic

            setTimeout(() => setShowModel(false), 100);
          }}
          style={[styles.button, { backgroundColor: theme.button }]}
          labelStyle={{ color: theme.buttonText, fontWeight: "700" }}
        >
          Continue
        </Button>
      </View>
    );
  };
  if (!item) {
    return (
      <View style={styles.errorContainer}>
        <LinearGradient
          colors={[theme.background, theme.card]}
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
          colors={[theme.background, theme.card]}
          style={styles.headerGradient}
        >
          {item?.[Core.Temple].image ? (
            <View style={styles.imageContainer}>
              <Image
                source={
                  typeof item?.[Core.Temple].image === "string"
                    ? { uri: item?.[Core.Temple].image }
                    : item?.[Core.Temple].image
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
              {item?.[Core.Name]}
            </Text>
            <View style={styles.templeInfoRow}>
              <Text variant="titleMedium" style={styles.templeName}>
                {item?.[Core.Name]}
              </Text>
              <Chip
                icon="map-marker"
                style={styles.locationChip}
                textStyle={styles.locationChipText}
              >
                {item?.[Core.Temple].location}
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
                <Text style={styles.infoValue}>
                  {item?.[Core.PujaDescription]?.lastDate}
                </Text>
              </View>

              <View style={styles.infoCard}>
                <Text style={styles.infoIcon}>💰</Text>
                <Text style={styles.infoLabel}>Starting From</Text>
                <Text style={styles.infoValue}>
                  ₹{item?.[Core.StartPrice].toLocaleString("en-IN")}
                </Text>
              </View>

              <View style={styles.infoCard}>
                <Text style={styles.infoIcon}>📦</Text>
                <Text style={styles.infoLabel}>Prasad</Text>
                <Text style={styles.infoValue}>
                  {item?.[Core.Temple].prasadDelivery?.included
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
              {item?.[Core.Description]?.map((desc, index) => {
                return (
                  <Text style={styles.descriptionText} key={index}>
                    {desc?.description}
                  </Text>
                );
              })}
            </View>
          </View>

          {/* Pricing Section */}
          <View style={styles.section}>
            <Text variant="titleLarge" style={styles.sectionHeader}>
              Choose Your Plans
            </Text>
            <ExpandablePlanSelector
              plans={transformedPlans}
              selectedPlan={selectedDevoteeType}
              onPlanSelect={(planId: string) => {
                setSelectedDevoteeType(planId);
                VibrationManager.selection();
              }}
            />
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
                    {item?.[Core.Temple].pandit.name}
                  </Text>
                  <Text style={styles.panditExperience}>
                    Experienced Temple Priest
                  </Text>
                </View>
              </View>
              <Text style={styles.panditDescription}>
                {item?.[Core.Temple].pandit.about}
              </Text>
            </View>
          </View>

          {/* Prasad Delivery Info */}
          {item?.[Core.Temple].prasadDelivery?.included && (
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
                        {item?.[Core.Temple].prasadDelivery.deliveryTime}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.deliveryRow}>
                  <View style={styles.deliveryItem}>
                    <Text style={styles.deliveryIcon}>🚚</Text>
                    <View>
                      <Text style={styles.deliveryLabel}>Delivery Charges</Text>
                      <Text style={styles.deliverySubtext}>
                        {item?.[Core.Temple].prasadDelivery.prasadCharge}
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
          onPress={() => {
            VibrationManager.selection();
            setShowModel(true);
          }}
          style={styles.fixedBookButton}
          contentStyle={styles.fixedButtonContent}
          labelStyle={styles.fixedBookButtonText}
        >
          Book This Puja
        </Button>
      </View>
      {
        <Model
          content={<View>{userForm()}</View>}
          isVisible={showModel}
          onRequestClose={() => {
            setShowModel(false);
          }}
          title={"Fill details"}
        />
      }
    </View>
  );
}

// local themed styles created above with useMemo

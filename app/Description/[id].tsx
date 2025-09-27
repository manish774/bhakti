import ExpandablePlanSelector from "@/components/ExpandableSelector/ExpandableSelector";
import Model from "@/components/Model";
import { Core, TempleMetadata } from "@/serviceManager/ServiceManager";
import { VibrationManager } from "@/utils/Vibrate";
import { useAuth } from "@clerk/clerk-expo";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Dimensions, Image, Platform, ScrollView, View } from "react-native";
import { Button, Chip, Divider, Snackbar, Text } from "react-native-paper";
import { useTheme } from "../../context/ThemeContext";
import rawJson from "../Data/raw.json";

import { imageMap } from "../utils/utils";
import { PackageForm, PrasadamForm } from "./DescriptionUtils";
import { styles as createStyles } from "./Styles";
const { width: screenWidth } = Dimensions.get("window");
const isWeb = Platform.OS === "web";
const maxWidth = isWeb ? 800 : screenWidth;
export default function Description() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const idParam = params.id as string | undefined;
  const navigation: any = useNavigation();
  const [selectedDevoteeType, setSelectedDevoteeType] = useState<string>();
  const [showModel, setShowModel] = useState<boolean>(false);
  const [showPrasadamModel, setShowPrasadamModel] = useState<boolean>(false);
  const [isFormCompleted, setIsFormCompleted] = useState<boolean>(false);
  const [snackVisible, setSnackVisible] = useState(false);
  const [snackMessage, setSnackMessage] = useState<string>("");
  const { isSignedIn } = useAuth();

  const item = rawJson.data.find((d: any) => d?.[Core.id] === idParam);
  const { theme } = useTheme();
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

  const bookPuja = useCallback(
    (item: TempleMetadata) => {
      VibrationManager.selection();
      router.push(
        `/Description/BookPuja?id=${
          item?.[Core.id]
        }&selectedDevotee=${selectedDevoteeType}`
      );
    },
    [selectedDevoteeType, router]
  );

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
                source={imageMap?.[item?.[Core.Temple].image]}
                style={styles.heroImage}
                resizeMode="cover"
              />
            </View>
          ) : (
            <View style={styles.imageContainer}>
              <Text>test image</Text>
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
                <Text style={styles.infoValue}>₹{item?.[Core.StartPrice]}</Text>
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
                setIsFormCompleted(true);
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

          {
            // <View style={styles.section}>
            //   <View style={styles.deliveryCard}>
            //     <Text style={styles.deliveryLabel}>
            //       Want to Book prasad only ?
            //     </Text>
            //     <Button
            //       mode={"contained-tonal"}
            //       onPress={() => {
            //         VibrationManager.selection();
            //         setTimeout(() => setShowPrasadamModel(true), 300);
            //       }}
            //       style={styles.fixedBookButton}
            //       contentStyle={[styles.fixedButtonContent]}
            //       labelStyle={styles.fixedBookButtonText}
            //     >
            //       Get prasadam
            //     </Button>
            //   </View>
            // </View>
          }

          {/* Spacer to prevent content from being hidden behind fixed button */}
          <View style={styles.bottomSpacer} />
        </View>
      </ScrollView>
      <View>
        <Button
          mode="contained"
          onPress={() => {
            if (!isFormCompleted) {
              VibrationManager.error();
              setSnackMessage("Please select a package to continue");
              setSnackVisible(true);
              return;
            }

            if (!isSignedIn) {
              VibrationManager.selection();
              // Navigate to login screen with return path
              router.push(
                `/login?returnTo=/Description/BookPuja?id=${
                  item?.[Core.id]
                }&selectedDevotee=${selectedDevoteeType}`
              );
              return;
            }

            VibrationManager.selection();
            bookPuja(item as unknown as TempleMetadata);
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
          content={
            <View>
              <PackageForm
                pujaName="meng"
                nos={3}
                isFormCompleted
                setShowModel={setShowModel}
                templeName={item?.["core.temple"]?.name}
                amount="1000"
                lastDate={item?.["core.pujaDescription"]?.lastDate}
              />
            </View>
          }
          isVisible={showModel}
          onRequestClose={() => {
            setShowModel(false);
          }}
          title={"Fill details"}
        />
      }
      {
        <Model
          content={
            <PrasadamForm
              isFormCompleted
              setShowModel={setShowPrasadamModel}
              templeName={item?.["core.temple"]?.name}
              amount={item?.[
                "core.temple"
              ].prasadDelivery?.prasadCharge?.toString()}
              nos={1}
              lastDate={item?.["core.pujaDescription"].lastDate}
              pujaName={item?.["core.pujaDescription"].pujaName || ""}
            />
          }
          isVisible={showPrasadamModel}
          onRequestClose={() => {
            setShowPrasadamModel(false);
          }}
          title={"Fill details"}
        />
      }
      <Snackbar
        visible={snackVisible}
        onDismiss={() => setSnackVisible(false)}
        action={{
          label: "OK",
          onPress: () => {
            setSnackVisible(false);
          },
        }}
        duration={3000}
        style={{ backgroundColor: theme.background }}
      >
        <Text style={{ color: theme.text }}>{snackMessage}</Text>
      </Snackbar>
    </View>
  );
}

// local themed styles created above with useMemo

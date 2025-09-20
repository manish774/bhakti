import FlowerRain from "@/components/FlowerRain";
import SwipeButton from "@/components/SwipeButton";
import { useAuth } from "@/context/UserContext";
import { Core, TempleMetadata } from "@/serviceManager/ServiceManager";
import { VibrationManager } from "@/utils/Vibrate";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  Platform,
  StatusBar,
  View,
} from "react-native";
import {
  ActivityIndicator,
  Card,
  Chip,
  Searchbar,
  Text,
} from "react-native-paper";
import SplashScreen from "../../components/SplashScreen";
import { useTheme } from "../../context/ThemeContext";
import rawJson from "../Data/raw.json";
import AuthScreen from "../login";
import { createStyles } from "../styles";
import { imageMap } from "../utils/utils";
import SelectCorePujaType from "./SelectCorePujaType";

const { width: screenWidth } = Dimensions.get("window");
const isWeb = Platform.OS === "web";
const numColumns = isWeb && screenWidth > 768 ? 2 : 1;

// AnimatedLetters: splits a string and animates each character in sequence
function AnimatedLetters({
  text,
  style,
  delay = 0,
}: {
  text: string;
  style?: any;
  delay?: number;
}) {
  const letters = text.split("");
  const animValues = useRef(letters.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    const animations = animValues.map((val, i) =>
      Animated.timing(val, {
        toValue: 1,
        duration: 300,
        delay: delay + i * 70,
        useNativeDriver: true,
      })
    );

    Animated.stagger(50, animations).start();
  }, [animValues, delay]);

  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
      {letters.map((char, i) => (
        <Animated.Text
          key={`char-${i}`}
          style={[
            style,
            {
              opacity: animValues[i],
              transform: [
                {
                  translateY: animValues[i].interpolate({
                    inputRange: [0, 1],
                    outputRange: [8, 0],
                  }),
                },
              ],
            },
          ]}
        >
          {char}
        </Animated.Text>
      ))}
    </View>
  );
}

// Removed unused TempleInfo interface

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);
  const router = useRouter();
  const navigation: any = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { clerkLoaded, isSignedIn, corePujaType } = useAuth();

  // Splash images to use as placeholders when item image is missing
  const splashImages = useMemo(
    () => [
      require("@/assets/splash/5.jpg"),
      require("@/assets/splash/1.jpg"),
      require("@/assets/splash/2.jpg"),
      require("@/assets/splash/3.jpg"),
      require("@/assets/splash/4.jpg"),
    ],
    []
  );

  // Process data once and memoize
  const allData: TempleMetadata[] = useMemo(() => {
    const metadata: TempleMetadata[] = rawJson?.data as TempleMetadata[];
    if (!metadata || !Array.isArray(metadata)) {
      console.log("No data found in rawJson");
      return [];
    }

    return metadata;
  }, []);

  // Filter data based on search
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) {
      return allData;
    }

    const query = searchQuery.toLowerCase().trim();
    return allData.filter((item) => {
      return (
        item[Core.Name].toLowerCase().includes(query) ||
        JSON.stringify(item?.[Core.Description])
          ?.toLowerCase()
          .includes(query) ||
        item?.[Core.Temple].location.toLowerCase().includes(query)
      );
    });
  }, [allData, searchQuery]);

  // Get visible data
  const visibleData = useMemo(() => {
    return filteredData.slice(0, visibleCount);
  }, [filteredData, visibleCount]);

  // Handle splash screen animation
  useEffect(() => {
    if (!showSplash) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }).start();
    }
  }, [showSplash, fadeAnim]);

  // Toggle the native/header visibility while splash is showing
  useEffect(() => {
    if (navigation && typeof navigation.setOptions === "function") {
      navigation.setOptions({ headerShown: !showSplash });
    }
  }, [navigation, showSplash]);

  // Reset visible count when search changes
  useEffect(() => {
    setVisibleCount(6);
    setIsLoading(false);
  }, [searchQuery]);

  // Load more items
  const loadMore = useCallback(() => {
    if (isLoading || visibleCount >= filteredData.length) {
      return;
    }

    setIsLoading(true);
    VibrationManager.lightImpact();

    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + 6, filteredData.length));
      setIsLoading(false);
    }, 300);
  }, [isLoading, visibleCount, filteredData.length]);

  // Handle end reached
  const handleEndReached = useCallback(() => {
    if (visibleCount < filteredData.length && !isLoading) {
      loadMore();
    } else {
      VibrationManager.lightImpact();
    }
  }, [visibleCount, filteredData.length, isLoading, loadMore]);

  // Handle booking
  const handleBooking = useCallback(
    (item: TempleMetadata) => {
      VibrationManager.selection();
      router.push({
        pathname: "/Description/[id]",
        params: { id: item?.[Core.id] },
      });
    },
    [router]
  );

  // Render item with proper animation
  const renderItem = useCallback(
    ({ item }: { item: TempleMetadata }) => {
      return (
        <View style={[styles.cardContainer]}>
          <Animated.View style={{ opacity: fadeAnim }}>
            <Card
              style={[styles.card, numColumns > 1 && styles.webCard]}
              elevation={4}
            >
              {/* Hero Image Section */}
              <View style={styles.imageSection}>
                {item?.[Core.Temple].image ? (
                  <>
                    <Image
                      source={imageMap[item?.[Core.Temple].image]}
                      style={styles.cardImage}
                      resizeMode="cover"
                    />
                    <LinearGradient
                      colors={["transparent", "rgba(0,0,0,0.7)"]}
                      style={styles.imageOverlay}
                    />
                    <View style={styles.imageContent}>
                      <Chip
                        icon="calendar-clock"
                        style={styles.dateChip}
                        textStyle={styles.dateChipText}
                      >
                        Until {item?.[Core.PujaDescription].lastDate}
                      </Chip>
                    </View>
                  </>
                ) : (
                  <View style={styles.placeholderImage}>
                    <Image
                      source={
                        splashImages[
                          Math.floor(Math.random() * splashImages.length)
                        ]
                      }
                      style={styles.cardImage}
                      resizeMode="cover"
                    />
                  </View>
                )}
              </View>

              {/* Content Section */}
              <View style={styles.cardContent}>
                <View style={styles.titleSection}>
                  <Text
                    variant="titleLarge"
                    style={styles.cardTitle}
                    numberOfLines={2}
                  >
                    {item?.[Core.Name]}
                  </Text>
                  <View style={styles.templeInfo}>
                    <Text style={styles.templeName} numberOfLines={1}>
                      {item?.[Core.Temple]?.name}
                    </Text>
                    <View style={styles.locationRow}>
                      <Text style={styles.locationIcon}>📍</Text>
                      <Text style={styles.location} numberOfLines={1}>
                        {item?.[Core.Temple].location}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.priceSection}>
                  <Text style={styles.priceLabel}>Starting from</Text>
                  <Text style={styles.priceValue}>
                    ₹{item?.[Core.StartPrice].toLocaleString("en-IN")}
                  </Text>
                  {item?.[Core.Temple].prasadDelivery?.included && (
                    <Chip
                      style={styles.prasadChip}
                      textStyle={styles.prasadChipText}
                    >
                      📦 Prasad Included
                    </Chip>
                  )}
                </View>

                {/* Swipe Button */}
                <View style={styles.swipeSection}>
                  <SwipeButton
                    label="Swipe to Continue"
                    onToggle={(isToggled) => {
                      if (isToggled) {
                        handleBooking(item);
                      }
                    }}
                    config={{
                      width: numColumns > 1 ? 280 : screenWidth - 80,
                      height: 60,
                      gradientColors: [theme.button, theme.accent],
                      thumbColor: theme.button,
                      thumbColorActive: "#ffffff",
                      textColor: theme.button,
                      fontSize: 16,
                      fontWeight: "700",
                      shadowOpacity: 0.2,
                      shadowRadius: 8,
                    }}
                  />
                </View>
              </View>
            </Card>
          </Animated.View>
        </View>
      );
    },
    [fadeAnim, handleBooking, styles, theme, splashImages]
  );

  // Static header component to prevent re-renders affecting search
  const HeaderComponent = useMemo(
    () => (
      <View style={styles.header}>
        <LinearGradient
          colors={[theme.background, theme.card]}
          style={styles.headerGradient}
        >
          <FlowerRain />
          <AnimatedLetters
            text="Experience spiritual bliss"
            style={styles.headerTitle}
          />
          <Text style={styles.headerSubtitle}>
            Your path to divine blessings begins with a simple booking.
          </Text>
        </LinearGradient>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Searchbar
            placeholder="Search pujas, temples, locations..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchBar}
            inputStyle={styles.searchInput}
            iconColor={theme.button}
            autoCorrect={false}
            autoCapitalize="none"
          />
        </View>
      </View>
    ),
    [searchQuery, styles, theme]
  );

  const FooterComponent = useMemo(() => {
    if (!isLoading || visibleCount >= filteredData.length) return null;

    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator animating={true} color={theme.button} size="large" />
        <Text style={styles.loadingText}>Loading more pujas...</Text>
      </View>
    );
  }, [isLoading, visibleCount, filteredData.length, styles, theme]);

  const EmptyComponent = useMemo(() => {
    if (!searchQuery.trim()) return null;

    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyIcon}>🔍</Text>
        <Text variant="titleLarge" style={styles.emptyTitle}>
          We did not find this
        </Text>
        <Text style={styles.emptyText}>
          Try different keywords or clear the search to see all pujas.
        </Text>
      </View>
    );
  }, [searchQuery, styles]);

  // Debug logging
  useEffect(() => {
    console.log("Debug Info:", {
      totalItems: allData.length,
      filteredItems: filteredData.length,
      visibleItems: visibleData.length,
      visibleCount,
      searchQuery: `"${searchQuery}"`,
      isLoading,
      showSplash,
    });
  }, [
    allData.length,
    filteredData.length,
    visibleData.length,
    visibleCount,
    searchQuery,
    isLoading,
    showSplash,
  ]);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  // Show loading while Clerk is loading
  if (!clerkLoaded) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color={theme.accent} />
      </View>
    );
  }

  console.log(isSignedIn, "lllllll");
  return (
    <View style={styles.container}>
      {!isSignedIn ? (
        <AuthScreen />
      ) : !corePujaType ? (
        <SelectCorePujaType
          onSelection={(type) => {
            console.log("Selected puja type:", type);
          }}
        />
      ) : (
        <>
          <StatusBar
            backgroundColor={theme.background}
            barStyle="dark-content"
          />
          <FlatList
            ref={flatListRef}
            data={visibleData}
            renderItem={renderItem}
            keyExtractor={(item) => `${item?.[Core.id]}-${searchQuery}`}
            numColumns={numColumns}
            ListHeaderComponent={HeaderComponent}
            ListFooterComponent={FooterComponent}
            ListEmptyComponent={EmptyComponent}
            showsVerticalScrollIndicator={false}
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.2}
            contentContainerStyle={[
              styles.listContainer,
              visibleData.length === 0 &&
                searchQuery.trim() &&
                styles.emptyContainer,
            ]}
            columnWrapperStyle={numColumns > 1 ? styles.row : undefined}
            initialNumToRender={6}
            maxToRenderPerBatch={6}
            windowSize={10}
            removeClippedSubviews={false}
            maintainVisibleContentPosition={{
              minIndexForVisible: 0,
              autoscrollToTopThreshold: 0,
            }}
            extraData={`${visibleCount}-${searchQuery}-${isLoading}`}
          />
        </>
      )}

      {/* <FAB
        icon="filter-variant"
        style={styles.fab}
        onPress={() => {
          VibrationManager.stop();
          console.log("Filter pressed");
        }}
        color="#ffffff"
      /> */}
    </View>
  );
}

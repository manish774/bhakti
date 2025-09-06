import FlowerRain from "@/components/FlowerRain";
import SwipeButton from "@/components/SwipeButton";
import { VibrationManager } from "@/utils/Vibrate";
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
  FAB,
  Searchbar,
  Text,
} from "react-native-paper";
import SplashScreen from "../../components/SplashScreen";
import { useTheme } from "../../context/ThemeContext";
import rawJson from "../Data/raw.json";
import { createStyles } from "../styles";

const { width: screenWidth } = Dimensions.get("window");
const isWeb = Platform.OS === "web";
const numColumns = isWeb && screenWidth > 768 ? 2 : 1;

interface TempleInfo {
  name: string;
  location: string;
  image: string;
  price: {
    oneDevotee: number;
    twoDevotees: number;
    fourDevotees: number;
    extraCharges: number;
  };
  prasadDelivery: {
    included: boolean;
    deliveryTime: string;
  };
  pandit: {
    name: string;
    about: string;
  };
}

interface TempleList {
  id: string;
  title: string;
  lastDate: string;
  description: {
    point1: string;
    point2: string;
  };
  temple: TempleInfo;
}

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  // Process data once and memoize
  const allData: TempleList[] = useMemo(() => {
    if (!rawJson?.data || !Array.isArray(rawJson.data)) {
      console.log("No data found in rawJson");
      return [];
    }

    return rawJson.data.map((item: any, index: number) => ({
      id: item.id || index.toString(),
      title: item.title || "",
      lastDate: item.lastDate || "",
      description: item.description || { point1: "", point2: "" },
      temple: {
        name: item.temple?.name || "",
        location: item.temple?.location || "",
        image: typeof item.temple?.image === "string" ? item.temple.image : "",
        price: item.temple?.price || {
          oneDevotee: 0,
          twoDevotees: 0,
          fourDevotees: 0,
          extraCharges: 0,
        },
        prasadDelivery: item.temple?.prasadDelivery || {
          included: false,
          deliveryTime: "",
        },
        pandit: item.temple?.pandit || {
          name: "",
          about: "",
        },
      },
    }));
  }, []);

  // Filter data based on search
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) {
      return allData;
    }

    const query = searchQuery.toLowerCase().trim();
    return allData.filter((item) => {
      return (
        item.title.toLowerCase().includes(query) ||
        item.temple.name.toLowerCase().includes(query) ||
        item.temple.location.toLowerCase().includes(query)
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
    (item: TempleList) => {
      VibrationManager.selection();
      router.push({
        pathname: "/Description/[id]",
        params: { id: item.id },
      });
    },
    [router]
  );

  // Render item with proper animation
  const renderItem = useCallback(
    ({ item }: { item: TempleList }) => {
      return (
        <View style={[styles.cardContainer]}>
          <Animated.View style={{ opacity: fadeAnim }}>
            <Card
              style={[styles.card, numColumns > 1 && styles.webCard]}
              elevation={4}
            >
              {/* Hero Image Section */}
              <View style={styles.imageSection}>
                {item.temple.image ? (
                  <>
                    <Image
                      source={{ uri: item.temple.image }}
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
                        Until {item.lastDate}
                      </Chip>
                    </View>
                  </>
                ) : (
                  <View style={styles.placeholderImage}>
                    <Image
                      source={require("@/assets/gods/shiv.jpg")}
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
                    {item.title}
                  </Text>
                  <View style={styles.templeInfo}>
                    <Text style={styles.templeName} numberOfLines={1}>
                      {item.temple.name}
                    </Text>
                    <View style={styles.locationRow}>
                      <Text style={styles.locationIcon}>📍</Text>
                      <Text style={styles.location} numberOfLines={1}>
                        {item.temple.location}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Price Section */}
                <View style={styles.priceSection}>
                  <Text style={styles.priceLabel}>Starting from</Text>
                  <Text style={styles.priceValue}>
                    ₹{item.temple.price.oneDevotee.toLocaleString("en-IN")}
                  </Text>
                  {item.temple.prasadDelivery?.included && (
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
                    label="Swipe to Book"
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
    [fadeAnim, handleBooking, styles, theme]
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
          <Text variant="headlineLarge" style={styles.headerTitle}>
            Sacred Pujas
          </Text>
          <Text style={styles.headerSubtitle}>
            Divine blessings at your fingertips
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
          No pujas found
        </Text>
        <Text style={styles.emptyText}>
          Try searching with different keywords or check back later.
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

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={theme.background} barStyle="dark-content" />

      <FlatList
        ref={flatListRef}
        data={visibleData}
        renderItem={renderItem}
        keyExtractor={(item) => `${item.id}-${searchQuery}`}
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

      <FAB
        icon="filter-variant"
        style={styles.fab}
        onPress={() => {
          VibrationManager.stop();
          console.log("Filter pressed");
        }}
        color="#ffffff"
      />
    </View>
  );
}

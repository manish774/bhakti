import SwipeButton from "@/components/SwipeButton";
import { BhaktiColors } from "@/constants/Colors";
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
  StyleSheet,
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
import rawJson from "../Data/raw.json";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");
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
      VibrationManager.pulse();
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
                    <Text style={styles.placeholderText}>🕉️</Text>
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
                      gradientColors: [
                        BhaktiColors.button,
                        BhaktiColors.accent,
                      ],
                      thumbColor: BhaktiColors.button,
                      thumbColorActive: "#ffffff",
                      textColor: BhaktiColors.button,
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
    [fadeAnim, handleBooking]
  );

  // Static header component to prevent re-renders affecting search
  const HeaderComponent = useMemo(
    () => (
      <View style={styles.header}>
        <LinearGradient
          colors={[BhaktiColors.background, BhaktiColors.card]}
          style={styles.headerGradient}
        >
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
            iconColor={BhaktiColors.button}
            autoCorrect={false}
            autoCapitalize="none"
          />
        </View>
      </View>
    ),
    [searchQuery]
  );

  const FooterComponent = useMemo(() => {
    if (!isLoading || visibleCount >= filteredData.length) return null;

    return (
      <View style={styles.loadingFooter}>
        <ActivityIndicator
          animating={true}
          color={BhaktiColors.button}
          size="large"
        />
        <Text style={styles.loadingText}>Loading more pujas...</Text>
      </View>
    );
  }, [isLoading, visibleCount, filteredData.length]);

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
  }, [searchQuery]);

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
      <StatusBar
        backgroundColor={BhaktiColors.background}
        barStyle="dark-content"
      />

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BhaktiColors.background,
  },

  // Header Styles
  header: {
    marginBottom: 16,
  },
  headerGradient: {
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 32,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  headerTitle: {
    color: BhaktiColors.text,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 8,
    textShadowColor: "rgba(0,0,0,0.1)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  headerSubtitle: {
    color: BhaktiColors.text,
    fontSize: 16,
    textAlign: "center",
    fontWeight: "500",
    opacity: 0.8,
  },

  // Search
  searchContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  searchBar: {
    backgroundColor: BhaktiColors.card,
    borderRadius: 25,
    elevation: 4,
    shadowColor: BhaktiColors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 2,
    borderColor: BhaktiColors.cardBorder,
  },
  searchInput: {
    fontSize: 16,
    color: BhaktiColors.text,
  },

  // List Styles
  listContainer: {
    paddingHorizontal: isWeb ? 16 : 12,
    paddingBottom: 100,
    ...(isWeb && {
      paddingHorizontal: 24,
      maxWidth: 1200,
      alignSelf: "center",
      width: "100%",
    }),
  },
  row: {
    justifyContent: "space-around",
    paddingHorizontal: 8,
  },

  // Card Styles
  cardContainer: {
    flex: numColumns > 1 ? 0.48 : 1,
    marginVertical: 8,
    marginHorizontal: numColumns > 1 ? 8 : 4,
    ...(isWeb &&
      numColumns > 1 && {
        flex: 0.48,
        marginVertical: 12,
        marginHorizontal: 12,
      }),
  },
  card: {
    borderRadius: 20,
    elevation: 6,
    shadowColor: BhaktiColors.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    backgroundColor: BhaktiColors.card,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: BhaktiColors.cardBorder,
    ...(isWeb && {
      borderRadius: 24,
      maxWidth: 380,
      shadowOffset: { width: 0, height: 6 },
      shadowRadius: 16,
    }),
  },
  webCard: {
    maxWidth: isWeb ? 380 : undefined,
  },

  // Image Section
  imageSection: {
    position: "relative",
    height: 200,
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  placeholderImage: {
    width: "100%",
    height: "100%",
    backgroundColor: BhaktiColors.background,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: BhaktiColors.cardBorder,
  },
  placeholderText: {
    fontSize: 48,
    opacity: 0.3,
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  imageContent: {
    position: "absolute",
    top: 12,
    right: 12,
  },
  dateChip: {
    backgroundColor: "rgba(255,255,255,0.95)",
    borderColor: BhaktiColors.accent,
    borderWidth: 2,
    elevation: 3,
  },
  dateChipText: {
    color: BhaktiColors.accent,
    fontWeight: "700",
    fontSize: 12,
  },

  // Content Section
  cardContent: {
    padding: 20,
    ...(isWeb && {
      padding: 24,
    }),
    backgroundColor: BhaktiColors.card,
  },
  titleSection: {
    marginBottom: 16,
  },
  cardTitle: {
    fontWeight: "800",
    color: BhaktiColors.text,
    lineHeight: 28,
    marginBottom: 8,
  },
  templeInfo: {
    gap: 6,
  },
  templeName: {
    fontSize: 16,
    fontWeight: "600",
    color: BhaktiColors.text,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  locationIcon: {
    fontSize: 14,
  },
  location: {
    fontSize: 14,
    color: BhaktiColors.text,
    fontWeight: "500",
    opacity: 0.8,
  },

  // Price Section - MAJOR IMPROVEMENT
  priceSection: {
    backgroundColor: BhaktiColors.background,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: BhaktiColors.cardBorder,
    alignItems: "center",
    shadowColor: BhaktiColors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  priceLabel: {
    fontSize: 13,
    color: BhaktiColors.text,
    fontWeight: "600",
    marginBottom: 4,
    opacity: 0.8,
  },
  priceValue: {
    fontSize: 24,
    fontWeight: "800",
    color: BhaktiColors.text,
    marginBottom: 8,
  },
  prasadChip: {
    backgroundColor: BhaktiColors.button,
    borderColor: BhaktiColors.accent,
    borderWidth: 1,
    elevation: 2,
  },
  prasadChipText: {
    color: BhaktiColors.buttonText,
    fontWeight: "600",
    fontSize: 11,
  },

  // Swipe Section
  swipeSection: {
    alignItems: "center",
    marginTop: 8,
    ...(isWeb && {
      marginTop: 12,
    }),
  },

  // Loading Footer
  loadingFooter: {
    paddingVertical: 32,
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    color: BhaktiColors.text,
    fontWeight: "600",
  },

  // Empty State
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 64,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
    opacity: 0.3,
  },
  emptyTitle: {
    color: BhaktiColors.text,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyText: {
    color: BhaktiColors.text,
    textAlign: "center",
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.8,
  },

  // FAB - IMPROVED
  fab: {
    position: "absolute",
    margin: 20,
    right: 0,
    bottom: 0,
    backgroundColor: BhaktiColors.button,
    borderRadius: 28,
    elevation: 8,
    shadowColor: BhaktiColors.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});

import FlowerRain from "@/components/FlowerRain";
import SwipeButton from "@/components/SwipeButton";
import { useAuth } from "@/context/UserContext";
import ServiceManager, {
  ApiTempleResponse,
} from "@/serviceManager/ServiceManager";
import { VibrationManager } from "@/utils/Vibrate";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
// removed unused useRouter import
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
import AuthScreen from "../auth/login";
import { createStyles } from "../styles";
import { imageMap, pujaOptions, RootStackParamList } from "../utils/utils";
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

type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null); // null = checking, true = first launch, false = not first launch
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);
  // router removed - not used with new data shape
  const navigation = useNavigation<NavigationProps>();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { isLoaded, isLoggedIn, isSignedIn, corePujaType } = useAuth();
  const service = ServiceManager.getInstance();
  const [typeData, setTypeData] = useState<ApiTempleResponse[]>([]);
  const [pageLimit, setPageLimit] = useState<{ page: number; limit: number }>({
    page: 1,
    limit: 2,
  });
  // Use a ref to store the initial limit so the initial fetch effect
  // doesn't need to depend on the pageLimit object (avoids overwriting
  // the list when pageLimit.page is incremented).
  const initialLimitRef = useRef(pageLimit.limit);
  // Check if it's the first launch
  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const hasLaunchedBefore = await AsyncStorage.getItem(
          "hasLaunchedBefore"
        );
        if (hasLaunchedBefore === null) {
          // First launch
          setIsFirstLaunch(true);
          await AsyncStorage.setItem("hasLaunchedBefore", "true");
        } else {
          // Not first launch
          setIsFirstLaunch(false);
          setShowSplash(false); // Skip splash screen
        }
      } catch (error) {
        console.log("Error checking first launch:", error);
        setIsFirstLaunch(true); // Default to showing splash on error
      }
    };

    checkFirstLaunch();
  }, []);

  useEffect(() => {
    // Fetch first page once when user is logged in. Use the initial limit
    // from the ref so this effect does not re-run when pageLimit.page changes.
    if (!isLoggedIn) return;
    service
      .fetchAllTemples({ page: 1, limit: initialLimitRef.current })
      .then((res) => {
        // fetchAllTemples returns ApiTempleResponse[] directly
        setTypeData(res?.data?.data as ApiTempleResponse[]);
      });
  }, [isLoggedIn, service]);

  // Handle splash screen finish
  const handleSplashFinish = useCallback(() => {
    setShowSplash(false);
  }, []);

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
  // const templeData: TempleMetadata[] = useMemo(() => {
  //   const metadata: TempleMetadata[] = rawJson?.data as TempleMetadata[];
  //   if (!metadata || !Array.isArray(metadata)) {
  //     console.log("No data found in rawJson");
  //     return [];
  //   }

  //   return metadata;
  // }, []);

  // Filter data based on search
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) {
      return typeData;
    }

    const query = searchQuery.toLowerCase().trim();
    // Basic filter on temple name or location
    return typeData.filter((t) => {
      return (
        (t.name && t.name.toLowerCase().includes(query)) ||
        (t.location && t.location.toLowerCase().includes(query)) ||
        (t.packages || [])
          .map((p) => p.name?.toLowerCase())
          .some((n) => n?.includes(query))
      );
    });
  }, [searchQuery, typeData]);

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
      navigation.setOptions({
        headerShown: isLoggedIn,
        title: pujaOptions?.find((puja) => puja.type === corePujaType)?.title,
        gestureEnabled: false,
      });
    }
  }, [navigation, isLoggedIn, corePujaType]);

  // Reset visible count when search changes
  useEffect(() => {
    setVisibleCount(6);
    setIsLoading(false);
  }, [searchQuery]);

  // Load more items
  const loadMore = useCallback(async () => {
    // guard to avoid duplicate loads
    if (isLoading) {
      return;
    }

    setIsLoading(true);
    VibrationManager.lightImpact();
    const data = await service.fetchAllTemples({
      page: pageLimit.page + 1,
      limit: pageLimit.limit,
    });

    setTypeData((prevData) => [
      ...prevData,
      ...(data?.data?.data as ApiTempleResponse[]),
    ]);
    setPageLimit((prev) => ({ page: prev.page + 1, limit: prev.limit }));
    setVisibleCount((prevCount) => prevCount + 6);
    setIsLoading(false);
  }, [isLoading, pageLimit.page, pageLimit.limit, service]);

  // Handle end reached
  const handleEndReached = useCallback(() => {
    if (!isLoading) {
      loadMore();
    } else {
      VibrationManager.lightImpact();
    }
  }, [isLoading, loadMore]);

  // Handle booking
  const handleBooking = useCallback(
    (item: ApiTempleResponse) => {
      VibrationManager.selection();
      // router.push({
      //   pathname: "/Description/[id]",
      //   params: { id: item?.[Core.id] },
      // });
      navigation.navigate("Description", {
        id: item?._id,
      });
    },
    [navigation]
  );

  // Render item with proper animation
  const renderItem = useCallback(
    ({ item }: { item: ApiTempleResponse }) => {
      return (
        <View style={[styles.cardContainer]}>
          <Animated.View style={{ opacity: fadeAnim }}>
            <Card
              style={[styles.card, numColumns > 1 && styles.webCard]}
              elevation={4}
            >
              {/* Hero Image Section */}
              <View style={styles.imageSection}>
                {item?.image ? (
                  <>
                    <Image
                      source={imageMap[item.image]}
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
                        {item.updatedAt
                          ? `Updated ${new Date(
                              item.updatedAt
                            ).toLocaleDateString()}`
                          : ""}
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
                    {item?.name}
                  </Text>
                  <View style={styles.templeInfo}>
                    <Text style={styles.templeName} numberOfLines={1}>
                      {item?.location}
                    </Text>
                    {/* <View style={styles.locationRow}>
                      <Text style={styles.locationIcon}>🏷️</Text>
                      <Text style={styles.location} numberOfLines={1}>
                        {item?.packages?.[0]?.name}
                      </Text>
                    </View> */}
                  </View>
                </View>

                <View style={styles.priceSection}>
                  <Text style={styles.priceLabel}>Starting from</Text>
                  <Text style={styles.priceValue}>
                    ₹
                    {(item?.packages && item.packages.length
                      ? Math.min(...item.packages.map((p) => p.price))
                      : 0
                    ).toLocaleString("en-IN")}
                  </Text>
                  {item?.prasadDelivery?.included && (
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

  // Don't render anything while checking first launch status
  if (isFirstLaunch === null) {
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

  // Show splash only on first launch
  if (showSplash && isFirstLaunch) {
    return <SplashScreen onFinish={handleSplashFinish} />;
  }

  // Show loading while auth is loading
  if (!isLoaded) {
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
            keyExtractor={(item) => `${item?._id}-${searchQuery}`}
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

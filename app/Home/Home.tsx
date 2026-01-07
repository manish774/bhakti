import { useAuth } from "@/context/UserContext";
import { EventProps } from "@/serviceManager/services/Event/event.types";
import { useEvent } from "@/serviceManager/services/Event/useEvent";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Dimensions,
  FlatList,
  Platform,
  RefreshControl,
  StatusBar,
  View,
} from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { useTheme } from "../../context/ThemeContext";
import AuthScreen from "../auth/login";
import { createStyles } from "../styles";
import { RootStackParamList } from "../utils/utils";
import SelectCorePujaType from "./SelectCorePujaType";
import EmptyState from "./components/EmptyState";
import HomeHeader from "./components/HomeHeader";
import PujaCard from "./components/PujaCard";

const { width: screenWidth } = Dimensions.get("window");
const isWeb = Platform.OS === "web";
const numColumns = isWeb && screenWidth > 768 ? 2 : 1;

type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

export default function Home() {
  const navigation = useNavigation<NavigationProps>();
  const flatListRef = useRef<FlatList>(null);

  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const { isLoaded, isLoggedIn, isSignedIn, corePujaType } = useAuth();
  const { fetchEvents } = useEvent({ autoFetch: false });

  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [events, setEvents] = useState<EventProps[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const _baseURL = useMemo(
    () => process.env.EXPO_PUBLIC_API_BASE_URL || "https://api.jalsuvidha.com/",
    []
  );

  /* ---------- First Launch Check ---------- */
  useEffect(() => {
    (async () => {
      try {
        const launched = await AsyncStorage.getItem("hasLaunchedBefore");
        if (!launched) {
          setIsFirstLaunch(true);
          await AsyncStorage.setItem("hasLaunchedBefore", "true");
        } else {
          setIsFirstLaunch(false);
        }
      } catch {
        setIsFirstLaunch(false);
      }
    })();
  }, []);

  const fetchAllEvents = useCallback(async () => {
    if (!isLoggedIn) return;

    setLoading(true);
    try {
      const res = await fetchEvents({ page: 1, limit: 10000 });
      console.log(res);
      setEvents(res || []);
    } finally {
      setLoading(false);
    }
  }, [isLoggedIn, fetchEvents]);

  useEffect(() => {
    fetchAllEvents();
  }, [fetchAllEvents]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchAllEvents();
    setRefreshing(false);
  }, [fetchAllEvents]);

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return events;

    const q = searchQuery.toLowerCase();
    return events.filter(
      (e: any) =>
        e?.eventName?.toLowerCase().includes(q) ||
        (e?.packageId || []).some((p: string) => p.toLowerCase().includes(q))
    );
  }, [events, searchQuery]);

  useEffect(() => {
    navigation.setOptions({
      headerShown: isLoggedIn,
      title: "Home",
      gestureEnabled: false,
    });
  }, [navigation, isLoggedIn, corePujaType]);

  // Memoize the renderItem with all dependencies
  const renderItem = useCallback(
    ({ item }: { item: EventProps }) => (
      <PujaCard
        item={item}
        styles={styles}
        theme={theme}
        _baseURL={_baseURL}
        numColumns={numColumns}
      />
    ),
    [styles, theme, _baseURL]
  );

  // Memoize keyExtractor
  const keyExtractor = useCallback((item: EventProps) => item.eventName, []);

  // Memoize ListHeaderComponent
  const ListHeaderComponent = useMemo(
    () => (
      <HomeHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        styles={styles}
        theme={theme}
      />
    ),
    [searchQuery, styles, theme]
  );

  // Memoize ListEmptyComponent
  const ListEmptyComponent = useMemo(
    () => (searchQuery ? <EmptyState styles={styles} /> : null),
    [searchQuery, styles]
  );

  // Memoize RefreshControl
  const refreshControl = useMemo(
    () => (
      <RefreshControl
        refreshing={refreshing}
        onRefresh={onRefresh}
        tintColor={theme.accent}
      />
    ),
    [refreshing, onRefresh, theme.accent]
  );

  // Memoize columnWrapperStyle
  const columnWrapperStyle = useMemo(
    () => (numColumns > 1 ? styles.row : undefined),
    [styles.row]
  );

  if (isFirstLaunch === null || !isLoaded || loading) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color={theme.accent} />
      </View>
    );
  }

  console.log(isSignedIn, "d");
  if (!isSignedIn) return <AuthScreen />;

  if (!corePujaType) return <SelectCorePujaType onSelection={() => {}} />;

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={theme.background} barStyle="dark-content" />

      <FlatList
        ref={flatListRef}
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        numColumns={numColumns}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={ListEmptyComponent}
        refreshControl={refreshControl}
        columnWrapperStyle={columnWrapperStyle}
        removeClippedSubviews={Platform.OS === "android"}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        initialNumToRender={10}
        windowSize={10}
        showsVerticalScrollIndicator={false}
        getItemLayout={(data, index) => ({
          length: 400, // Approximate height of each card
          offset: 400 * index,
          index,
        })}
      />
    </View>
  );
}

import SwipeButton from "@/components/SwipeButton";
import { ITemple } from "@/serviceManager/api";
import ServiceManager from "@/serviceManager/ServiceManager";
import { EventProps } from "@/serviceManager/services/Event/event.types";
import { PackageProps } from "@/serviceManager/services/Package/packages.types";
import { usePackage } from "@/serviceManager/services/Package/usePackage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Image, View } from "react-native";
import { Card, Chip, Text } from "react-native-paper";
import { imageMap, RootStackParamList } from "../../utils/utils";
import ImageCarousel from "./ImageCarousel";
type NavigationProps = NativeStackNavigationProp<RootStackParamList>;
export default function PujaCard({
  item: itm,
  styles,
  theme,
  fadeAnim,
  _baseURL,
  numColumns,
}: any) {
  const item = itm as EventProps;
  const { fetchPackageByIDs } = usePackage({ autoFetch: false });
  const [temples, setTemples] = useState<ITemple[]>([]);
  const [pckgs, setPkgs] = useState<PackageProps[]>([]);
  const service = ServiceManager.getInstance();
  const navigation = useNavigation<NavigationProps>();

  const localOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchPackageByIDs(item.packageId).then((x) => {
      setPkgs(x as PackageProps[]);
    });
  }, [item, fetchPackageByIDs]);

  useEffect(() => {
    const templeList = item?.templeId;
    service.getTempleIds({ ids: templeList }).then((x) => setTemples(x));
  }, [item, service]);

  useEffect(() => {
    Animated.timing(localOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [localOpacity]);

  const prices = pckgs
    ?.map((pk) => Number(pk.price))
    .filter((p) => !Number.isNaN(p));

  const minPrice = prices && prices.length > 0 ? Math.min(...prices) : 0;

  return (
    <>
      {temples.map((x, index) => (
        <View style={[styles.cardContainer]} key={x._id}>
          <Animated.View style={{ opacity: localOpacity }}>
            <Card
              style={[styles.card, numColumns > 1 && styles.webCard]}
              elevation={4}
            >
              <View style={styles.imageSection}>
                {x?.image ? (
                  <>
                    <ImageCarousel
                      images={[x.image]}
                      baseURL={_baseURL}
                      style={styles.cardImage}
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
                        {x?.updatedAt
                          ? `Updated ${new Date(
                              x.updatedAt
                            ).toLocaleDateString()}`
                          : ""}
                      </Chip>
                    </View>
                  </>
                ) : (
                  <View style={styles.placeholderImage}>
                    <Image
                      source={imageMap["default.jpg"]}
                      style={styles.cardImage}
                      resizeMode="cover"
                    />
                  </View>
                )}
              </View>

              <View style={styles.cardContent}>
                <View style={styles.titleSection}>
                  <Text
                    variant="titleLarge"
                    style={styles.cardTitle}
                    numberOfLines={2}
                  >
                    {item?.eventName}
                  </Text>
                  <View style={styles.templeInfo}>
                    <Text style={styles.templeName} numberOfLines={1}>
                      {x?.name} -{" "}
                      {x?.location?.addressLine1 || "location not found"}
                    </Text>
                  </View>
                </View>

                <View style={styles.priceSection}>
                  <Text style={styles.priceLabel}>Starting from</Text>
                  <Text style={styles.priceValue}>{minPrice}</Text>
                </View>

                <View style={styles.swipeSection}>
                  <SwipeButton
                    label="Swipe to Continue"
                    onToggle={(isToggled: boolean) => {
                      if (isToggled) {
                        navigation.navigate("Description", { id: x._id });
                      }
                    }}
                    config={{
                      width: numColumns > 1 ? 280 : 360,
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
      ))}
    </>
  );
}

import ExpandablePlanSelector from "@/components/ExpandableSelector/ExpandableSelector";
import Model from "@/components/Model";
import { useAuth } from "@/context/UserContext";
import ServiceManager, {
  Core,
  TempleMetadata,
} from "@/serviceManager/ServiceManager";
import { VibrationManager } from "@/utils/Vibrate";
import { RouteProp } from "@react-navigation/native";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Dimensions, Platform, ScrollView, View } from "react-native";
import { Button, Divider, Snackbar, Text } from "react-native-paper";
import { useTheme } from "../../context/ThemeContext";

import { usePackage } from "@/serviceManager/services/Package/usePackage";
import { StackNavigationProp } from "@react-navigation/stack";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { RootStackParamList } from "../utils/utils";
import DescriptionList from "./components/DescriptionList";
import ErrorView from "./components/ErrorView";
import HeroHeader from "./components/HeroHeader";
import PanditCard from "./components/PanditCard";
import PrasadDelivery from "./components/PrasadDelivery";
import QuickInfo from "./components/QuickInfo";
import TitleSection from "./components/TitleSection";
import { PackageForm, PrasadamForm } from "./DescriptionUtils";
import { styles as createStyles } from "./Styles";

const { width: screenWidth } = Dimensions.get("window");
const isWeb = Platform.OS === "web";
const maxWidth = isWeb ? 800 : screenWidth;

type DescriptionScreenRouteProp = RouteProp<RootStackParamList, "Description">;
type DescriptionScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Description"
>;

type Props = {
  route: DescriptionScreenRouteProp;
  navigation: DescriptionScreenNavigationProp;
};

export const Description: React.FC<Props> = ({ route, navigation }) => {
  const router = useRouter();

  const { id: idParam, packages } = route.params;

  const [showModel, setShowModel] = useState<boolean>(false);
  const [showPrasadamModel, setShowPrasadamModel] = useState<boolean>(false);
  const [isFormCompleted, setIsFormCompleted] = useState<boolean>(false);
  const [snackVisible, setSnackVisible] = useState(false);
  const [snackMessage, setSnackMessage] = useState<string>("");
  const { isLoggedIn } = useAuth();
  const [item, setItem] = useState<TempleMetadata | null>(null);
  const service = ServiceManager.getInstance();
  const insets = useSafeAreaInsets();

  console.log(packages);
  const { theme } = useTheme();
  const styles = createStyles({ theme, maxWidth, platform: Platform });
  const _baseURL =
    process.env.EXPO_PUBLIC_API_BASE_URL || "https://api.jalsuvidha.com/";

  const { fetchPackageByIDs } = usePackage({ autoFetch: false });

  const pckg = packages ? JSON.parse(packages) : [];
  const [selectedPackage, setSelectedPackage] = useState<Record<string, any>>(
    pckg[0]?._id
  );

  useEffect(() => {
    service.fetchTempleData(idParam as string).then((data) => {
      setItem(data);
    });
  }, [idParam, service, fetchPackageByIDs]);

  const transformedPlans = useMemo(() => {
    if (!packages || !Array.isArray(JSON.parse(packages))) {
      return [];
    }
    return JSON.parse(packages)?.map((x) => ({ ...x, id: x._id }));
  }, [packages]);

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
        }&selectedPackage=${selectedPackage}`
      );
    },
    [selectedPackage, router]
  );

  if (!item) {
    return (
      <ErrorView
        onExplore={() => router.push("/")}
        styles={styles}
        theme={theme}
      />
    );
  }

  return (
    <View style={styles.mainContainer}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <HeroHeader item={item} baseURL={_baseURL} styles={styles} />

        <View style={styles.contentCard}>
          <TitleSection item={item} styles={styles} />
          <Divider style={styles.sectionDivider} />
          <QuickInfo item={item} styles={styles} />
          <Divider style={styles.sectionDivider} />
          <DescriptionList
            descriptions={item?.[Core.Description] || item?.description || []}
            styles={styles}
          />

          <View style={styles.section}>
            <Text variant="titleLarge" style={styles.sectionHeader}>
              Choose Your Plans
            </Text>
            <ExpandablePlanSelector
              plans={transformedPlans}
              selectedPlan={selectedPackage?._id}
              onPlanSelect={(plan) => {
                console.log(plan, "ppllaann");
                setIsFormCompleted(true);

                setSelectedPackage(plan);
                VibrationManager.selection();
              }}
            />
          </View>
          <PanditCard item={item} styles={styles} />
          {item?.prasadDelivery?.included && (
            <PrasadDelivery
              prasadDelivery={item.prasadDelivery}
              styles={styles}
            />
          )}

          <View style={styles.bottomSpacer} />
        </View>
      </ScrollView>
      <View style={[{ paddingBottom: insets.bottom }]}>
        <Button
          mode="contained"
          onPress={() => {
            if (!isFormCompleted) {
              VibrationManager.error();
              setSnackMessage("Please select a package to continue");
              setSnackVisible(true);
              return;
            }

            if (isLoggedIn) {
              VibrationManager.selection();
              navigation.navigate("bookingPage", {
                id: item?.[Core.id],
                selectedPackage: selectedPackage,
                packages,
              });
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
                templeName={item?.name}
                amount="1000"
                lastDate={item?.pujaDescription?.lastDate}
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
              templeName={item?.name}
              amount={item?.prasadDelivery?.prasadCharge?.toString()}
              nos={1}
              lastDate={item?.pujaDescription?.lastDate}
              pujaName={item?.pujaDescription?.pujaName || ""}
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
};

// local themed styles created above with useMemo

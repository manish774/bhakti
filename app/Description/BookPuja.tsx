import Stepper from "@/components/stepper/Stepper";
import { useTheme } from "@/context/ThemeContext";
import { Core } from "@/serviceManager/ServiceManager";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Card } from "react-native-paper";
import rawJson from "../Data/raw.json";
import { RootStackParamList } from "../utils/utils";
import { createPackageSteps } from "./utils";

type DescriptionScreenRouteProp = RouteProp<RootStackParamList, "bookingPage">;
type DescriptionScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "bookingPage"
>;

type Props = {
  route: DescriptionScreenRouteProp;
  navigation: DescriptionScreenNavigationProp;
};

const BookPuja: React.FC<Props> = ({ route }) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const { id, selectedDevotee } = route.params;
  const item = rawJson.data.find((d: any) => d?.[Core.id] === id);
  const temple = item?.["core.temple"];
  const puja = item?.["core.pujaDescription"];
  const selectedDevoteeType = temple?.packages?.find(
    (x) => x.id === selectedDevotee
  );

  const HeaderContent = () => (
    <View style={styles.headerContainer}>
      {/* Temple Section */}
      <Text style={styles.sectionHeading}>🏛 Temple</Text>
      <Text style={styles.templeName}>{temple?.name || "Sacred Temple"}</Text>
      {temple?.location && (
        <Text style={styles.subText}>📍 {temple.location}</Text>
      )}

      <View style={styles.divider} />

      {/* Puja Section */}
      <Text style={styles.sectionHeading}>🙏 Puja</Text>
      <Text style={styles.pujaName}>{puja?.pujaName || "Special Puja"}</Text>
      {puja?.description && (
        <Text style={styles.subText}>{puja.description}</Text>
      )}

      <View style={styles.divider} />

      {/* Amount Section */}
      <View style={styles.amountBox}>
        <Text style={styles.amountTitle}>💰 Offering Amount</Text>
        <Text style={styles.amount}>₹100</Text>
        <Text style={styles.subText}>Inclusive of all charges</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Page Heading */}
        <View style={styles.headerWrapper}>
          <View style={styles.titleRow}>
            <Text style={styles.pageTitle}>Book Puja</Text>
            <Text style={styles.pageEmoji}>🪔</Text>
          </View>
          <View style={styles.accentBar} />
          <Text style={styles.pageSubtitle}>
            Enter devotee details & confirm your booking
          </Text>
        </View>

        {/* Stepper + Info Card */}
        <Card style={styles.headerCard} elevation={4}>
          <Card.Content>
            <Stepper
              steps={createPackageSteps(
                selectedDevoteeType?.numberOfPerson as number
              )}
              onSubmit={(data) => {
                alert(JSON.stringify(data));
              }}
              bottomContent={<HeaderContent />}
            />
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollView: {
      flex: 1,
    },
    scrollContent: {
      padding: 16,
      paddingBottom: 120,
    },

    /* Header */
    headerWrapper: {
      marginBottom: 20,
    },
    titleRow: {
      flexDirection: "row",
      alignItems: "center",
    },
    pageTitle: {
      fontSize: 24,
      fontWeight: "600",
      color: theme.text,
    },
    pageEmoji: {
      fontSize: 20,
      marginLeft: 6,
    },
    accentBar: {
      width: 40,
      height: 3,
      backgroundColor: theme.button,
      borderRadius: 2,
      marginTop: 6,
      marginBottom: 12,
    },
    pageSubtitle: {
      fontSize: 14,
      color: theme.text,
      opacity: 0.7,
      lineHeight: 20,
    },

    /* Card & Sections */
    headerCard: {
      borderRadius: 18,
      backgroundColor: theme.card,
      padding: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 4,
    },
    headerContainer: {
      marginTop: 20,
      paddingHorizontal: 8,
    },
    sectionHeading: {
      fontSize: 16,
      fontWeight: "600",
      marginTop: 16,
      color: theme.text,
    },
    templeName: {
      fontSize: 20,
      fontWeight: "700",
      marginTop: 6,
      color: theme.button,
    },
    pujaName: {
      fontSize: 18,
      fontWeight: "600",
      marginVertical: 6,
      color: theme.text,
    },
    subText: {
      fontSize: 14,
      color: theme.text,
      opacity: 0.7,
      marginBottom: 6,
      lineHeight: 20,
    },
    divider: {
      height: 1,
      backgroundColor: "#EAEAEA",
      marginVertical: 16,
    },

    /* Amount Box */
    amountBox: {
      marginTop: 20,
      alignItems: "center",
      padding: 16,
      borderRadius: 14,
      backgroundColor: `${theme.button}15`,
      shadowColor: theme.button,
      shadowOpacity: 0.08,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 4,
    },
    amountTitle: {
      fontSize: 15,
      fontWeight: "500",
      color: theme.text,
      marginBottom: 6,
    },
    amount: {
      fontSize: 28,
      fontWeight: "800",
      color: theme.button,
      marginBottom: 6,
    },
  });

export default BookPuja;

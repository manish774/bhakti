import Stepper from "@/components/stepper/Stepper";
import { useTheme } from "@/context/ThemeContext";
import { Core } from "@/serviceManager/ServiceManager";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import { Card } from "react-native-paper";
import rawJson from "../Data/raw.json";
import { createPackageSteps } from "./utils";

const { width, height } = Dimensions.get("window");

const BookPuja = () => {
  const { id, selectedDevotee } = useLocalSearchParams<{
    id: string;
    selectedDevotee: string;
  }>();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const item = rawJson.data.find((d: any) => d?.[Core.id] === id);
  const temple = item?.["core.temple"];
  const puja = item?.["core.pujaDescription"];
  const selectedDevoteeType = item?.["core.temple"]?.packages?.find(
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

      {/* Puja Section */}
      <Text style={styles.sectionHeading}>🙏 Puja</Text>
      <Text style={styles.pujaName}>{puja?.pujaName || "Special Puja"}</Text>
      {puja?.description && (
        <Text style={styles.subText}>{puja.description}</Text>
      )}

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
        <Text style={styles.pageTitle}>🪔 Book Puja</Text>
        <Text style={styles.pageSubtitle}>
          Enter devotee details & confirm your booking
        </Text>

        <Card style={styles.headerCard} elevation={3}>
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
    container: { flex: 1, backgroundColor: theme.background },
    backgroundImage: { flex: 1 },
    backgroundImageStyle: { opacity: 0.05 },
    scrollView: { flex: 1 },
    scrollContent: { padding: 3, paddingBottom: 100 },
    pageTitle: {
      fontSize: 28,
      fontWeight: "bold",
      textAlign: "center",
      marginVertical: 8,
      color: theme.text,
    },
    pageSubtitle: {
      fontSize: 15,
      textAlign: "center",
      marginBottom: 24,
      color: theme.text,
      opacity: 0.7,
    },
    headerContainer: { marginVertical: 20 },
    headerCard: {
      borderRadius: 16,
      backgroundColor: theme.card,
      padding: 2,
    },
    sectionHeading: {
      fontSize: 18,
      fontWeight: "600",
      marginTop: 16,
      color: theme.text,
    },
    templeName: {
      fontSize: 22,
      fontWeight: "bold",
      marginTop: 6,
      color: theme.text,
    },
    pujaName: {
      fontSize: 20,
      fontWeight: "600",
      marginVertical: 6,
      color: theme.text,
    },
    subText: {
      fontSize: 14,
      color: theme.text,
      opacity: 0.7,
      marginBottom: 6,
    },
    amountBox: {
      marginTop: 20,
      alignItems: "center",
      padding: 12,
      borderRadius: 12,
      backgroundColor: `${theme.button}10`,
    },
    amountTitle: { fontSize: 16, fontWeight: "500", color: theme.text },
    amount: { fontSize: 28, fontWeight: "bold", color: theme.button },
    ctaButton: {
      marginTop: 30,
      borderRadius: 10,
      paddingVertical: 6,
      backgroundColor: theme.button,
    },
  });
export default BookPuja;

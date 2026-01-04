import FlowerRain from "@/components/FlowerRain";
import React from "react";
import { View } from "react-native";
import { Searchbar, Text } from "react-native-paper";
import AnimatedLetters from "./AnimatedLetters";

export default function HomeHeader({
  searchQuery,
  setSearchQuery,
  styles,
  theme,
}: any) {
  return (
    <View style={styles.header}>
      <View style={styles.headerGradient}>
        <FlowerRain />
        <AnimatedLetters
          text="Experience spiritual bliss"
          style={styles.headerTitle}
        />
        <Text style={styles.headerSubtitle}>
          Your path to divine blessings begins with a simple booking.
        </Text>
      </View>

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
  );
}

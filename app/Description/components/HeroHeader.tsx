import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Image, Text, View } from "react-native";

type Props = {
  item: any;
  baseURL: string;
  styles: any;
};

export default function HeroHeader({ item, baseURL, styles }: Props) {
  return (
    <LinearGradient colors={["#fff", "#f6f6f6"]} style={styles.headerGradient}>
      {item?.image ? (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: `${baseURL}uploads/images/${item?.image}` }}
            style={styles.heroImage}
            resizeMode="cover"
          />
        </View>
      ) : (
        <View style={styles.imageContainer}>
          <Text>test image</Text>
        </View>
      )}
    </LinearGradient>
  );
}

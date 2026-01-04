import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";

type Props = {
  descriptions: string[];
  styles: any;
};

export default function DescriptionList({ descriptions = [], styles }: Props) {
  return (
    <View style={styles.section}>
      <Text variant="titleLarge" style={styles.sectionHeader}>
        ✨ About This Sacred Ritual
      </Text>
      <View style={styles.descriptionCard}>
        {descriptions.map((desc: string, index: number) => (
          <Text style={styles.descriptionText} key={index}>
            {desc}
          </Text>
        ))}
      </View>
    </View>
  );
}

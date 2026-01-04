import { Core } from "@/serviceManager/ServiceManager";
import React from "react";
import { View } from "react-native";
import { Chip, Text } from "react-native-paper";

type Props = {
  item: any;
  styles: any;
};

export default function TitleSection({ item, styles }: Props) {
  return (
    <View style={styles.titleSection}>
      <Text variant="headlineLarge" style={styles.mainTitle}>
        {item?.[Core.Name] || item?.name}
      </Text>
      <View style={styles.templeInfoRow}>
        <Text variant="titleMedium" style={styles.templeName}>
          {item?.[Core.Name] || item?.name}
        </Text>
        <Chip
          icon="map-marker"
          style={styles.locationChip}
          textStyle={styles.locationChipText}
        >
          {item?.location}
        </Chip>
      </View>
    </View>
  );
}

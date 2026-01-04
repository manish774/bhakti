import React from "react";
import { Text, View } from "react-native";

type Props = {
  item: any;
  styles: any;
};

export default function QuickInfo({ item, styles }: Props) {
  return (
    <View style={styles.quickInfoSection}>
      <View style={styles.infoGrid}>
        <View style={styles.infoCard}>
          <Text style={styles.infoIcon}>🗓️</Text>
          <Text style={styles.infoLabel}>Last Date</Text>
          <Text style={styles.infoValue}>
            {item?.pujaDescription?.lastDate || item?.lastDate}
          </Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoIcon}>💰</Text>
          <Text style={styles.infoLabel}>Starting From</Text>
          <Text style={styles.infoValue}>
            ₹{item?.startPrice || item?.["StartPrice"]}
          </Text>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoIcon}>📦</Text>
          <Text style={styles.infoLabel}>Prasad</Text>
          <Text style={styles.infoValue}>
            {item?.prasadDelivery?.included ? "Included" : "Not Included"}
          </Text>
        </View>
      </View>
    </View>
  );
}

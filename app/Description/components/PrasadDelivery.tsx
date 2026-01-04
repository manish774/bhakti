import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";

type Props = {
  prasadDelivery: any;
  styles: any;
};

export default function PrasadDelivery({ prasadDelivery, styles }: Props) {
  return (
    <View style={styles.section}>
      <Text variant="titleLarge" style={styles.sectionHeader}>
        🎁 Prasad Delivery
      </Text>
      <View style={styles.deliveryCard}>
        <View style={styles.deliveryRow}>
          <View style={styles.deliveryItem}>
            <Text style={styles.deliveryIcon}>✅</Text>
            <View>
              <Text style={styles.deliveryLabel}>Prasad Included</Text>
              <Text style={styles.deliverySubtext}>
                Sacred offerings from the temple
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.deliveryRow}>
          <View style={styles.deliveryItem}>
            <Text style={styles.deliveryIcon}>🚚</Text>
            <View>
              <Text style={styles.deliveryLabel}>Delivery Time</Text>
              <Text style={styles.deliverySubtext}>
                {prasadDelivery?.deliveryTime}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.deliveryRow}>
          <View style={styles.deliveryItem}>
            <Text style={styles.deliveryIcon}>🚚</Text>
            <View>
              <Text style={styles.deliveryLabel}>Delivery Charges</Text>
              <Text style={styles.deliverySubtext}>
                {prasadDelivery?.prasadCharge}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

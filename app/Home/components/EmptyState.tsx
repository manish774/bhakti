import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";

export default function EmptyState({ styles }: any) {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>🔍</Text>
      <Text variant="titleLarge" style={styles.emptyTitle}>
        We did not find this
      </Text>
      <Text style={styles.emptyText}>
        Try different keywords or clear the search to see all pujas.
      </Text>
    </View>
  );
}

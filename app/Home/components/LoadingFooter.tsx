import React from "react";
import { View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";

export default function LoadingFooter({ styles, theme }: any) {
  return (
    <View style={styles.loadingFooter}>
      <ActivityIndicator animating={true} color={theme.button} size="large" />
      <Text style={styles.loadingText}>Loading more pujas...</Text>
    </View>
  );
}

import React from "react";
import { View } from "react-native";
import { Button, Text } from "react-native-paper";

type Props = {
  onExplore: () => void;
  styles: any;
  theme: any;
};

export default function ErrorView({ onExplore, styles }: Props) {
  return (
    <View style={styles.errorContainer}>
      <View style={styles.errorContent}>
        <Text style={styles.errorEmoji}>🔍</Text>
        <Text variant="headlineSmall" style={styles.errorTitle}>
          Puja Not Found
        </Text>
        <Text style={styles.errorText}>
          The spiritual journey you are seeking is not available right now.
        </Text>
        <Button
          mode="contained"
          onPress={onExplore}
          style={styles.errorButton}
          labelStyle={styles.errorButtonText}
        >
          Explore Other Pujas
        </Button>
      </View>
    </View>
  );
}

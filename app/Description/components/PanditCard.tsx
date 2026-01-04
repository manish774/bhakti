import React from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";

type Props = {
  item: any;
  styles: any;
};

export default function PanditCard({ item, styles }: Props) {
  return (
    <View style={styles.section}>
      <Text variant="titleLarge" style={styles.sectionHeader}>
        🧘‍♂️ Your Spiritual Guide
      </Text>
      <View style={styles.panditCard}>
        <View style={styles.panditHeader}>
          <View style={styles.panditAvatar}>
            <Text style={styles.panditAvatarText}>🙏</Text>
          </View>
          <View style={styles.panditInfo}>
            <Text style={styles.panditName}>{item?.pandit?.name}</Text>
            <Text style={styles.panditExperience}>
              Experienced Temple Priest
            </Text>
          </View>
        </View>
        <Text style={styles.panditDescription}>{item?.pandit?.about}</Text>
      </View>
    </View>
  );
}

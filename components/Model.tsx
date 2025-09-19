import { useTheme } from "@/context/ThemeContext";
import React from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Button, Card } from "react-native-paper";

interface ModelProps {
  isVisible: boolean;
  transparent?: boolean;
  onRequestClose: () => void;
  coverSource?: any; // image source for Card.Cover
  title: string;
  content: React.ReactNode;
}

export default function Model(props: ModelProps) {
  const {
    isVisible,
    transparent = true,
    onRequestClose,
    title,
    content,
  } = props;

  const { theme } = useTheme();

  return (
    <Modal
      visible={isVisible}
      transparent={transparent}
      animationType="slide"
      onRequestClose={onRequestClose}
    >
      <KeyboardAvoidingView
        style={styles.modalBackground}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 50 : 20} // adjust if you have header
      >
        <View style={styles.modalContent}>
          <ScrollView
            contentContainerStyle={{ paddingBottom: 16 }}
            keyboardShouldPersistTaps="handled"
          >
            <Card>
              <Card.Title title={title} />
              <Card.Content>{content}</Card.Content>
              <Card.Actions>
                <Button
                  onPress={onRequestClose}
                  style={{ backgroundColor: theme.background }}
                >
                  Close
                </Button>
              </Card.Actions>
            </Card>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 0,
    minWidth: "90%",
    maxHeight: 319, // scroll if content exceeds 400
  },
});

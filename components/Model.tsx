import React from "react";
import { Button, Modal, StyleSheet, View } from "react-native";
import { Card } from "react-native-paper";

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

  return (
    <Modal
      visible={isVisible}
      transparent={transparent}
      animationType="slide"
      onRequestClose={onRequestClose}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContent}>
          <Card>
            <Card.Title title={title} />
            <Card.Content>{content}</Card.Content>
            <Card.Actions>
              <Button title="Close" onPress={onRequestClose} />
            </Card.Actions>
          </Card>
        </View>
      </View>
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
    minWidth: 350,
  },
});

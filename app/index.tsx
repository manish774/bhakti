import { Link } from "expo-router";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <View>
      <Text>Hello Spider</Text>
      <Link href={"/login"} style={styles.loginBtn}>
        Login
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  loginBtn: {
    width: 200,
    height: 30,
    textAlign: "center",
    backgroundColor: "red",
  },
});

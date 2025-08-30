import { useAuth } from "@/context/UserContext";
import React, { useState } from "react";
import { ImageBackground, StyleSheet, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const auth = useAuth();

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));
      auth.login({ name: "manish", email: "man", id: "test" });

      if (email === "user@example.com" && password === "password123") {
        // Navigate to home screen
        console.log("Login successful!");
      } else {
        setError("Invalid email or password.");
      }
    } catch (err) {
      setError("An error occurred during login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require("@/assets/images/Initial/1.jpg")}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.glassContainer}>
        <TextInput
          keyboardType={"visible-password"}
          placeholder={"Enter Email or password"}
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          textContentType={"password"}
          style={styles.input}
        />

        <Button mode={"contained"} style={styles.button}>
          Login
        </Button>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  glassContainer: {
    width: "85%",
    padding: 20,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.9,
    shadowRadius: 10,
    backdropFilter: "blur(10px)", // This works on web, not native
  },
  input: {
    width: "100%",
    marginBottom: 10,
  },
  button: {
    width: "100%",
  },
});

export default LoginScreen;

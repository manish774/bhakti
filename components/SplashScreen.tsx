// removed isWeb import — not needed after using useWindowDimensions for sizing
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Image,
  Platform,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
// import { Text } from "react-native-paper";

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onFinish();
    });
  }, []);

  //get
  const splashImages = [
    require("../assets/splash/5.jpg"),
    require("../assets/splash/1.jpg"),
    require("../assets/splash/2.jpg"),
    require("../assets/splash/3.jpg"),
    require("../assets/splash/4.jpg"),
  ];
  const randomSplashImage = Math.floor(Math.random() * splashImages.length);
  const { width, height } = useWindowDimensions();

  return (
    <View style={styles.container}>
      <Image
        source={splashImages[randomSplashImage]}
        style={[StyleSheet.absoluteFill, { width, height }]}
        resizeMode="cover"
      />
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
        }}
      >
        <View style={styles.textContainer}>
          <Animated.Text style={styles.splashText}>
            {/* Digital Devotion */}
          </Animated.Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  textContainer: {
    alignItems: "center",
    marginTop: 8,
  },
  splashText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#7c3aed",
    letterSpacing: 2,
    textShadowColor: "#e8c7f5",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    fontFamily:
      Platform.OS === "ios" ? "AvenirNext-DemiBold" : "sans-serif-medium",
  },
});

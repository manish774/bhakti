import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, Easing, StyleSheet, View } from "react-native";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

interface FlowerRainProps {
  count?: number;
  speed?: number;
}

const FLOWERS = [
  { name: require("@/assets/flowers/flower1.png") },
  { name: require("@/assets/flowers/flower.png") },
  { name: require("@/assets/flowers/chrysanthemum.png") },
];

const FlowerRain: React.FC<FlowerRainProps> = ({ count = 8, speed = 4200 }) => {
  const items = useRef(
    Array.from({ length: count }).map(() => ({
      top: new Animated.Value(-60),
      left: new Animated.Value(Math.random() * SCREEN_W),
      rotate: new Animated.Value(Math.random() * 360),
      opacity: new Animated.Value(0),
      delay: Math.random() * 1200,
      scale: new Animated.Value(0.8 + Math.random() * 0.6),
      // pick a random flower image for this particle
      image: FLOWERS[Math.floor(Math.random() * FLOWERS.length)].name,
    }))
  ).current;

  useEffect(() => {
    const animations = items.map((it, idx) => {
      const fall = Animated.sequence([
        Animated.delay(it.delay),
        Animated.parallel([
          Animated.timing(it.opacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
            easing: Easing.out(Easing.quad),
          }),
          Animated.timing(it.top, {
            toValue: SCREEN_H * 0.35 + Math.random() * 40,
            duration: speed + Math.random() * 900,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.quad),
          }),
          Animated.timing(it.left, {
            toValue: Math.random() * SCREEN_W,
            duration: speed + Math.random() * 900,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.quad),
          }),
          Animated.timing(it.rotate, {
            toValue: Math.random() * 360,
            duration: speed + Math.random() * 900,
            useNativeDriver: true,
            easing: Easing.linear,
          }),
        ]),
        Animated.timing(it.opacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]);

      return Animated.loop(fall, { resetBeforeIteration: true });
    });

    Animated.stagger(200, animations).start();

    return () => {
      animations.forEach((a) => a.stop && a.stop());
    };
  }, [items, speed]);

  return (
    <View pointerEvents="none" style={styles.container}>
      {items.map((it, i) => {
        const rotate = it.rotate.interpolate
          ? it.rotate.interpolate({
              inputRange: [0, 360],
              outputRange: ["0deg", "360deg"],
            })
          : (it.rotate as any);

        return (
          <Animated.Image
            key={`flower-${i}`}
            source={it.image}
            style={[
              styles.flower,
              {
                transform: [
                  { translateY: it.top },
                  { translateX: it.left },
                  { rotate: rotate },
                  { scale: it.scale },
                ],
                opacity: it.opacity,
              },
            ]}
            resizeMode="contain"
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
    zIndex: 1,
  },
  flower: {
    position: "absolute",
    width: 36,
    height: 36,
    left: 0,
    top: -60,
    opacity: 0.9,
  },
});

export default FlowerRain;

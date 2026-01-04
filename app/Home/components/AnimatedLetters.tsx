import React, { useEffect, useRef } from "react";
import { Animated, View } from "react-native";

export default function AnimatedLetters({
  text,
  style,
  delay = 0,
}: {
  text: string;
  style?: any;
  delay?: number;
}) {
  const letters = text.split("");
  const animValues = useRef(letters.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    const animations = animValues.map((val, i) =>
      Animated.timing(val, {
        toValue: 1,
        duration: 300,
        delay: delay + i * 70,
        useNativeDriver: true,
      })
    );

    Animated.stagger(50, animations).start();
  }, [animValues, delay]);

  return (
    <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
      {letters.map((char, i) => (
        <Animated.Text
          key={`char-${i}`}
          style={[
            style,
            {
              opacity: animValues[i],
              transform: [
                {
                  translateY: animValues[i].interpolate({
                    inputRange: [0, 1],
                    outputRange: [8, 0],
                  }),
                },
              ],
            },
          ]}
        >
          {char}
        </Animated.Text>
      ))}
    </View>
  );
}

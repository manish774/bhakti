import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo, useState } from "react";
import { StyleSheet } from "react-native";

import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  Extrapolate,
  interpolate,
  interpolateColor,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { useTheme } from "../context/ThemeContext";

const BUTTON_WIDTH = 360;
const BUTTON_HEIGHT = 80;
const BUTTON_PADDING = 10;
const SWIPEABLE_DIMENSIONS = BUTTON_HEIGHT - 2 * BUTTON_PADDING;

const H_WAVE_RANGE = SWIPEABLE_DIMENSIONS + 2 * BUTTON_PADDING;
const H_SWIPE_RANGE = BUTTON_WIDTH - 2 * BUTTON_PADDING - SWIPEABLE_DIMENSIONS;
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

interface SwipeButtonProps {
  onToggle: (isToggled: boolean) => void;
  label: string;
  config: Record<string, any>;
}

const SwipeButton: React.FC<SwipeButtonProps> = ({
  onToggle,
  label,
  config,
}) => {
  const { theme } = useTheme();
  const styles = useMemo(
    () =>
      StyleSheet.create({
        swipeCont: {
          height: BUTTON_HEIGHT,
          width: BUTTON_WIDTH,
          backgroundColor: theme.card,
          borderRadius: BUTTON_HEIGHT,
          padding: BUTTON_PADDING,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "row",
          borderWidth: 2,
          borderColor: theme.cardBorder,
        },
        colorWave: {
          position: "absolute",
          left: 0,
          height: BUTTON_HEIGHT,
          borderRadius: BUTTON_HEIGHT,
        },
        swipeable: {
          position: "absolute",
          left: BUTTON_PADDING,
          height: SWIPEABLE_DIMENSIONS,
          width: SWIPEABLE_DIMENSIONS,
          borderRadius: SWIPEABLE_DIMENSIONS,
          zIndex: 3,
          alignItems: "center",
          justifyContent: "center",
        },
        swipeText: {
          alignSelf: "center",
          fontSize: 20,
          fontWeight: "bold",
          zIndex: 2,
          color: theme.text,
          letterSpacing: 1,
        },
        swipeIcon: {
          color: theme.buttonText,
          fontSize: 18,
          fontWeight: "900",
          textAlign: "center",
        },
      }),
    [theme]
  );
  // Animated value for X translation
  const X = useSharedValue(0);
  // small scale value for 'give' animation while dragging
  const S = useSharedValue(1);
  // Toggled State
  const [toggled, setToggled] = useState(false);

  // Fires when animation ends
  const handleComplete = (isToggled: any) => {
    // Update toggled state and notify parent with actual state
    X.value = 0;
    setToggled(isToggled);
    onToggle(isToggled);
  };

  // Gesture Handler Events
  const animatedGestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.completed = toggled;
      // lift/scale up the knob a bit when the user starts touching
      S.value = withSpring(1.06, { damping: 12, stiffness: 180 });
    },
    onActive: (e, ctx) => {
      let newValue;
      if (ctx.completed) {
        newValue = H_SWIPE_RANGE + e.translationX;
      } else {
        newValue = e.translationX;
      }

      if (newValue >= 0 && newValue <= H_SWIPE_RANGE) {
        X.value = newValue;
      }
    },
    onEnd: () => {
      // release scale back to normal
      S.value = withSpring(1, { damping: 12, stiffness: 200 });
      if (X.value < BUTTON_WIDTH / 2 - SWIPEABLE_DIMENSIONS / 2) {
        X.value = withSpring(0);
        runOnJS(handleComplete)(false);
      } else {
        X.value = withSpring(H_SWIPE_RANGE);
        runOnJS(handleComplete)(true);
      }
    },
  });

  const InterpolateXInput = [0, H_SWIPE_RANGE];
  const AnimatedStyles = {
    swipeCont: useAnimatedStyle(() => {
      return {};
    }),
    colorWave: useAnimatedStyle(() => {
      return {
        width: H_WAVE_RANGE + X.value,

        opacity: interpolate(X.value, InterpolateXInput, [0, 1]),
      };
    }),
    swipeable: useAnimatedStyle(() => {
      return {
        backgroundColor: interpolateColor(
          X.value,
          [0, BUTTON_WIDTH - SWIPEABLE_DIMENSIONS - BUTTON_PADDING],
          [theme.button, theme.background] // button to background
        ),
        transform: [
          { translateX: X.value },
          { translateY: interpolate(S.value, [1, 1.06], [0, -3]) },
          { scale: S.value },
        ],
        // subtle shadow/elevation change while dragging
        shadowOpacity: interpolate(S.value, [1, 1.06], [0.15, 0.32]),
        elevation: S.value * 6,
      };
    }),
    // animated style for the chevron/icon inside the knob
    icon: useAnimatedStyle(() => {
      const tx = interpolate(
        X.value,
        [0, H_SWIPE_RANGE],
        [0, 12],
        Extrapolate.CLAMP
      );
      const rot = interpolate(
        X.value,
        [0, H_SWIPE_RANGE],
        [0, 14],
        Extrapolate.CLAMP
      );
      const scaleIcon = interpolate(S.value, [1, 1.06], [1, 1.12]);
      const opacity = interpolate(
        X.value,
        [0, H_SWIPE_RANGE],
        [1, 0.6],
        Extrapolate.CLAMP
      );
      return {
        transform: [
          { translateX: tx },
          { rotate: `${rot}deg` },
          { scale: scaleIcon },
        ],
        opacity,
      };
    }),
    swipeText: useAnimatedStyle(() => {
      return {
        opacity: interpolate(
          X.value,
          InterpolateXInput,
          [0.7, 0],
          Extrapolate.CLAMP
        ),
        transform: [
          {
            translateX: interpolate(
              X.value,
              InterpolateXInput,
              [0, BUTTON_WIDTH / 2 - SWIPEABLE_DIMENSIONS],
              Extrapolate.CLAMP
            ),
          },
        ],
      };
    }),
  };

  return (
    <Animated.View style={[styles.swipeCont, AnimatedStyles.swipeCont]}>
      <AnimatedLinearGradient
        style={[AnimatedStyles.colorWave, styles.colorWave]}
        colors={[theme.button, theme.background]} // button to background
        start={{ x: 0.0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
      />
      <PanGestureHandler onGestureEvent={animatedGestureHandler}>
        <Animated.View style={[styles.swipeable, AnimatedStyles.swipeable]}>
          <Animated.Text style={[styles.swipeIcon, AnimatedStyles.icon]}>
            »»
          </Animated.Text>
        </Animated.View>
      </PanGestureHandler>
      <Animated.Text style={[styles.swipeText, AnimatedStyles.swipeText]}>
        {label || "Swipe me"}
      </Animated.Text>
    </Animated.View>
  );
};

// styles are generated from theme via useMemo above

export default SwipeButton;

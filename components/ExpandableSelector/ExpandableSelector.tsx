import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { Divider } from "react-native-paper";
import { useTheme } from "../../context/ThemeContext";
import { VibrationManager } from "../../utils/Vibrate";

const isWeb = Platform.OS === "web";

interface Plan {
  id: string;
  title: string;
  isPopular: boolean;
  name: string;
  price: number;
  description: { id: string | number; detail: string }[];
}

interface ExpandablePlanSelectorProps {
  plans: Plan[];
  selectedPlan?: string;
  onPlanSelect: (planId: string) => void;
}

const MAX_EXPAND_HEIGHT = 380;

const ExpandablePlanSelector: React.FC<ExpandablePlanSelectorProps> = ({
  plans,
  selectedPlan,
  onPlanSelect,
}) => {
  const { theme } = useTheme();
  const [expandedPlan, setExpandedPlan] = useState<string | null>(null);

  const animRef = useRef<
    Record<
      string,
      {
        height: Animated.Value;
        opacity: Animated.Value;
        rotate: Animated.Value;
        scale: Animated.Value;
      }
    >
  >({}).current;

  useEffect(() => {
    plans.forEach((p) => {
      if (!animRef[p.id]) {
        animRef[p.id] = {
          height: new Animated.Value(0),
          opacity: new Animated.Value(0),
          rotate: new Animated.Value(0),
          scale: new Animated.Value(1),
        };
      }
    });
  }, [plans]);

  const animate = useCallback(
    (id: string, expand: boolean) => {
      const v = animRef[id];
      if (!v) return;
      Animated.parallel([
        Animated.timing(v.height, {
          toValue: expand ? 1 : 0,
          duration: 380,
          useNativeDriver: false,
        }),
        Animated.timing(v.opacity, {
          toValue: expand ? 1 : 0,
          duration: expand ? 420 : 260,
          delay: expand ? 120 : 0,
          useNativeDriver: false,
        }),
        Animated.timing(v.rotate, {
          toValue: expand ? 1 : 0,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.spring(v.scale, {
          toValue: expand ? 1.02 : 1,
          useNativeDriver: false,
          tension: 120,
          friction: 8,
        } as any),
      ]).start();
    },
    [animRef]
  );

  const toggleExpand = (id: string) => {
    VibrationManager.lightImpact();
    const was = expandedPlan === id;
    const next = was ? null : id;

    if (expandedPlan && expandedPlan !== id) animate(expandedPlan, false);
    animate(id, !was);
    setExpandedPlan(next);
  };

  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      {plans.map((plan) => {
        const vals = animRef[plan.id];
        const height = vals
          ? vals.height.interpolate({
              inputRange: [0, 1],
              outputRange: [0, MAX_EXPAND_HEIGHT],
            })
          : 0;
        const opacity = vals ? vals.opacity : 0;
        const rotate = vals
          ? vals.rotate.interpolate({
              inputRange: [0, 1],
              outputRange: ["0deg", "180deg"],
            })
          : "0deg";
        const scale = vals ? vals.scale : new Animated.Value(1);
        const isSelected = selectedPlan === plan.id;

        return (
          <Animated.View
            key={plan.id}
            style={[
              styles.card,
              plan.isPopular && styles.popular,
              isSelected && styles.selectedCard,
              { transform: [{ scale: scale as any }] },
            ]}
          >
            {plan.isPopular && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Popular</Text>
              </View>
            )}

            <View style={styles.header}>
              <View style={styles.left}>
                <Text style={styles.name}>{plan.name}</Text>
                <Text style={styles.desc}>{plan.title}</Text>
              </View>

              <Pressable
                style={styles.right}
                onPress={() => onPlanSelect(plan.id)}
              >
                <Text style={styles.price}>
                  ₹{plan.price.toLocaleString("en-IN")}
                </Text>
                <View
                  style={[
                    styles.checkbox,
                    isSelected && styles.checkboxChecked,
                  ]}
                >
                  {isSelected && <Text style={styles.checkboxTick}>✓</Text>}
                </View>
              </Pressable>
            </View>

            {/* Expandable content */}
            <Animated.View
              style={[styles.expandWrap, { maxHeight: height, opacity }]}
            >
              <View style={styles.expandInner}>
                <Divider style={styles.divider} />

                <Text style={styles.sectionTitle}>What&apos;s Included</Text>
                {plan.description.map((it, i) => (
                  <View key={i} style={styles.rowItem}>
                    <View style={styles.bullet} />
                    <Text style={styles.rowText}>{it.detail}</Text>
                  </View>
                ))}
              </View>
            </Animated.View>

            {/* Chevron toggle */}
            <Pressable
              style={styles.chevWrapper}
              onPress={() => toggleExpand(plan.id)}
            >
              <Animated.Text style={[styles.chev, { transform: [{ rotate }] }]}>
                ⌄
              </Animated.Text>
            </Pressable>
          </Animated.View>
        );
      })}
    </View>
  );
};

export default ExpandablePlanSelector;

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: { gap: 12 } as ViewStyle,
    card: {
      backgroundColor: theme.background,
      borderRadius: 12,
      overflow: "visible",
      borderWidth: 2,
      borderColor: theme.cardBorder,
      marginBottom: 15,
      elevation: 4,
      shadowColor: theme.text,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 10,
      position: "relative",
    } as ViewStyle,
    selectedCard: {
      borderColor: theme.accent,
      borderWidth: 2,
      elevation: 8,
    } as ViewStyle,
    popular: {
      borderColor: theme.button,
      backgroundColor: theme.card,
    } as ViewStyle,
    badge: {
      position: "absolute",
      right: 12,
      top: -12,
      backgroundColor: theme.accent,
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
      zIndex: 20,
      elevation: 6,
    } as ViewStyle,
    badgeText: {
      color: theme.buttonText,
      fontWeight: "700",
      fontSize: 12,
    } as TextStyle,
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: 18,
    } as ViewStyle,
    left: { flex: 1, marginRight: 8 } as ViewStyle,
    right: {
      alignItems: "center",
      justifyContent: "center",
    } as ViewStyle,
    name: {
      fontSize: 18,
      fontWeight: "800",
      color: theme.text,
      marginBottom: 4,
    } as TextStyle,
    desc: {
      fontSize: 13,
      color: theme.text,
      opacity: 0.75,
    } as TextStyle,
    price: {
      fontSize: 20,
      fontWeight: "900",
      color: theme.text,
      marginBottom: 6,
    } as TextStyle,
    checkbox: {
      width: 35,
      height: 35,
      borderRadius: 50,
      borderWidth: 1,
      borderColor: theme.cardBorder,
      alignItems: "center",
      justifyContent: "center",
    } as ViewStyle,
    checkboxChecked: {
      borderColor: theme.accent,
      backgroundColor: theme.accent,
    } as ViewStyle,
    checkboxTick: {
      color: theme.buttonText,
      fontWeight: "bold",
      fontSize: 14,
    } as TextStyle,
    chevWrapper: {
      position: "absolute",
      bottom: -16, // overflows below card
      alignSelf: "center",
      backgroundColor: theme.card,
      borderRadius: 20,
      padding: 6,
      elevation: 4,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      height: 40,
      width: 40,
      alignContent: "center",
      alignItems: "center",
    } as ViewStyle,
    chev: {
      fontSize: 22,
      fontWeight: "bold",
      color: theme.text,
      opacity: 0.7,
    } as TextStyle,
    expandWrap: {
      overflow: "hidden",
      backgroundColor: theme.background,
    } as ViewStyle,
    expandInner: {
      paddingHorizontal: isWeb ? 20 : 16,
      paddingBottom: 12,
      paddingTop: 6,
    } as ViewStyle,
    divider: {
      backgroundColor: theme.cardBorder,
      height: 1,
      marginVertical: 12,
    } as ViewStyle,
    sectionTitle: {
      fontWeight: "700",
      color: theme.text,
      marginBottom: 8,
    } as TextStyle,
    rowItem: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 8,
    } as ViewStyle,
    bullet: {
      width: 8,
      height: 8,
      borderRadius: 5,
      backgroundColor: theme.accent,
      marginRight: 12,
      marginTop: 6,
    } as ViewStyle,
    rowText: { flex: 1, color: theme.text, opacity: 0.85 } as TextStyle,
  });

import useToast from "@/app/utils/common";
import { useTheme } from "@/context/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import { goBack } from "expo-router/build/global-state/routing";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type OtpProps = {
  totalInput: number;
  onSubmit: (optValue: string[]) => void;
  successMessage?: string;
  buttonText?: string;
  isVerifying: boolean;
  goBack: () => void;
};

const OTPscreen = ({
  totalInput,
  onSubmit,
  buttonText = "Verify",
  isVerifying,
}: OtpProps) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [code, setCode] = useState<string[]>(
    Array.from({ length: totalInput })
  );

  const { toastVisible, toastMessage, toastAnim, showToast } = useToast();
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (!code?.length) {
      inputRefs.current[0]?.focus();
    }
  }, []);

  const onChangeHandler = async (text: string, i: number) => {
    if (text?.toString().length > 1) {
      if (isNaN(parseInt(text))) {
        return;
      }
      const newDigits = text.split("").slice(0, totalInput); // Limit to totalInput digits
      const newCode = Array.from({ length: totalInput }, (_, index) => {
        if (index < i) {
          return code[index] || ""; // Keep existing values before current index
        } else {
          const digitIndex = index - i;
          return digitIndex < newDigits.length ? newDigits[digitIndex] : "";
        }
      });
      setCode(newCode);

      // Focus on the last filled input or the last input if all are filled
      const lastFilledIndex = Math.min(
        i + newDigits.length - 1,
        totalInput - 1
      );
      inputRefs.current[lastFilledIndex]?.focus();
      if (text.length === totalInput) {
        onSubmit(newCode);
      }
    } else {
      // Update the current input
      const xCode = code?.map((x, ind) => (ind === i ? text : x));
      setCode(xCode);

      // Handle focus navigation
      if (text && i < totalInput - 1) {
        // If there's text and not the last input, move to next
        inputRefs.current[i + 1]?.focus();
      } else if (!text && i > 0) {
        // If text is deleted and not the first input, move to previous
        //inputRefs.current[i - 1]?.focus();
      }
      // If it's the last input and there's text, stay on current input
    }
  };

  const handleOnKeyPress = (e: any, i: number) => {
    if (e.nativeEvent.key === "Backspace") {
      inputRefs.current[i - 1]?.focus();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[theme.accent, theme.background]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <View style={styles.header}>
            <Text style={styles.welcomeText}>Check Your Email</Text>
            <Text style={styles.subtitleText}>
              {`We sent you a ${totalInput}-digit code to verify your email.`}
            </Text>
          </View>

          <View style={styles.authCard}>
            <View style={styles.formContainer}>
              <View style={styles.form}>
                <View style={styles.inputRow}>
                  {Array.from({ length: totalInput })?.map((x, i) => (
                    <View style={styles.inputContainer} key={i}>
                      <TextInput
                        ref={(el) => {
                          inputRefs.current[i] = el;
                        }}
                        style={styles.input}
                        placeholderTextColor="#999"
                        value={code?.[i]}
                        onChangeText={(e) => onChangeHandler(e, i)}
                        keyboardType="number-pad"
                        autoCapitalize="none"
                        onKeyPress={(e) => handleOnKeyPress(e, i)}
                        maxLength={totalInput}
                      />
                    </View>
                  ))}
                </View>

                <TouchableOpacity
                  style={[
                    styles.primaryButton,
                    isVerifying && styles.disabledButton,
                  ]}
                  onPress={() => {
                    console.log(code, "test");
                    onSubmit(code);
                  }}
                  disabled={isVerifying}
                >
                  <LinearGradient
                    colors={
                      isVerifying
                        ? [theme.cardBorder, theme.cardBorder]
                        : [theme.accent, theme.accent]
                    }
                    style={styles.buttonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    <Text style={styles.buttonText}>
                      {isVerifying ? "Verifying..." : buttonText}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              style={[
                styles.goBack,
                styles.primaryButton,
                isVerifying && styles.disabledButton,
              ]}
              onPress={goBack}
              disabled={isVerifying}
            >
              <LinearGradient
                colors={
                  isVerifying
                    ? [theme.cardBorder, theme.cardBorder]
                    : [theme.accent, theme.accent]
                }
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.buttonText}>Go Back</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>

        {/* Toast Notification */}
        {toastVisible && (
          <Animated.View
            style={[
              styles.toastContainer,
              {
                transform: [
                  {
                    translateY: toastAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [40, 0],
                    }),
                  },
                ],
                opacity: toastAnim,
              },
            ]}
          >
            <Text style={styles.toastText}>{toastMessage}</Text>
          </Animated.View>
        )}
      </LinearGradient>
    </SafeAreaView>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.background,
    },
    keyboardView: {
      padding: 10,
      paddingTop: 100,
      height: "100%",
    },
    header: {
      alignItems: "center",
      marginBottom: 40,
    },
    welcomeText: {
      fontSize: 32,
      fontWeight: "bold",
      color: theme.text,
      marginBottom: 8,
      textAlign: "center",
    },
    subtitleText: {
      fontSize: 16,
      color: theme.text,
      opacity: 0.8,
      textAlign: "center",
    },
    authCard: {
      backgroundColor: theme.card,
      borderRadius: 20,
      padding: 10,
      shadowColor: theme.text,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.25,
      shadowRadius: 20,
      elevation: 10,
      borderWidth: 2,
      borderColor: theme.cardBorder,
    },

    formContainer: {
      paddingHorizontal: 20,
    },
    form: {
      marginBottom: 20,
    },

    inputRow: {
      flexDirection: "row",
      justifyContent: "center", // center horizontally
    },

    inputContainer: {
      alignItems: "center",
      borderWidth: 2,
      borderColor: theme.cardBorder,
      borderRadius: 12,
      marginHorizontal: 2, // spacing between boxes
      paddingHorizontal: 10,
      backgroundColor: theme.background,
      elevation: 4,
      shadowColor: theme.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,

      marginBottom: 10,
    },
    input: {
      height: 50,
      fontSize: 20,
      width: 25,
      textAlign: "center", // 👈 centers each digit
      color: theme.text,
    },

    inputIcon: {
      marginRight: 12,
    },

    eyeIcon: {
      padding: 5,
    },
    errorContainer: {
      marginBottom: 16,
      marginTop: -12,
    },
    errorText: {
      color: "#ff4444",
      fontSize: 12,
      marginLeft: 15,
    },
    forgotPassword: {
      alignSelf: "flex-end",
      marginBottom: 20,
    },
    forgotPasswordText: {
      color: theme.accent,
      fontSize: 14,
      fontWeight: "500",
    },
    primaryButton: {
      marginTop: 16,
      borderRadius: 12,
      overflow: "hidden",
      marginBottom: 10,
      backgroundColor: theme.accent,
      elevation: 4,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
    },
    buttonGradient: {
      paddingVertical: 15,
      alignItems: "center",
    },
    buttonText: {
      color: theme.buttonText,
      fontSize: 16,
      fontWeight: "600",
    },
    toastContainer: {
      position: "absolute",
      bottom: 50,
      left: 20,
      right: 20,
      backgroundColor: theme.text,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 8,
      alignItems: "center",
      elevation: 8,
      shadowColor: theme.text,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
    toastText: {
      color: theme.background,
      fontSize: 14,
      fontWeight: "600",
      textAlign: "center",
    },
    disabledButton: {
      opacity: 0.6,
    },
    goBack: {
      width: 100,
    },
  });

export default OTPscreen;

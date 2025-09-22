import useToast from "@/app/utils/common";
import { useTheme } from "@/context/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo, useState } from "react";
import {
  Animated,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type OtpProps = {
  totalInput: number;
  onSubmit: () => void;
  successMessage?: string;
  buttonText?: string;
};

const OTPscreen = ({
  totalInput,
  onSubmit,
  buttonText = "Verify",
}: OtpProps) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [code, setCode] = useState<string>();
  const [isVerifying, setIsVerifying] = useState<boolean>();
  const { toastVisible, toastMessage, toastAnim, showToast } = useToast();

  const onVerifyPress = async () => {
    // if (isVerifying) return;
    // // Validate code input
    // if (!code || code.length < 6) {
    //   VibrationManager.error();
    //   showToast("Please enter a valid 6-digit verification code");
    //   return;
    // }
    // setIsVerifying(true);
    // try {
    //   const signUpAttempt = await signUp.attemptEmailAddressVerification({
    //     code,
    //   });
    //   if (signUpAttempt.status === "complete") {
    //     VibrationManager.success();
    //     showToast("Email verified successfully!");
    //     await setActive({ session: signUpAttempt.createdSessionId });
    //     if (returnTo) {
    //       router.push(returnTo as any);
    //     } else {
    //       router.push("/");
    //     }
    //   } else {
    //     VibrationManager.error();
    //     console.error(
    //       "Verification incomplete:",
    //       JSON.stringify(signUpAttempt, null, 2)
    //     );
    //     // Handle incomplete verification
    //     let errorMessage = "Verification failed. Please try again.";
    //     if ((signUpAttempt as any)?.errors?.[0]?.message) {
    //       errorMessage = (signUpAttempt as any).errors[0].message;
    //     }
    //     showToast(errorMessage);
    //   }
    // } catch (err: any) {
    //   VibrationManager.error();
    //   console.error("Verification error:", JSON.stringify(err, null, 2));
    //   // Extract user-friendly error message
    //   let errorMessage = "Invalid verification code. Please try again.";
    //   if (err?.errors?.[0]?.message) {
    //     errorMessage = err.errors[0].message;
    //   } else if (err?.message) {
    //     errorMessage = err.message;
    //   }
    //   showToast(errorMessage);
    // } finally {
    //   setIsVerifying(false);
    // }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[theme.accent, theme.background]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        > */}
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
                      style={styles.input}
                      placeholderTextColor="#999"
                      value={code}
                      onChangeText={(text) => setCode(text)}
                      keyboardType="number-pad"
                      autoCapitalize="none"
                      maxLength={1}
                    />
                  </View>
                ))}
              </View>

              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  isVerifying && styles.disabledButton,
                ]}
                onPress={onVerifyPress}
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
        </View>
        {/* </KeyboardAvoidingView> */}

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
    gradient: {
      //   flex: 1,
    },
    keyboardView: {
      //   flex: 1,

      padding: 20,
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
      marginHorizontal: 6, // spacing between boxes
      paddingHorizontal: 10,
      backgroundColor: theme.background,
      elevation: 4,
      shadowColor: theme.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      width: 45,
      marginBottom: 10,
    },
    input: {
      height: 50,
      fontSize: 20,
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
  });

export default OTPscreen;

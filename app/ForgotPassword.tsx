import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useMemo, useState } from "react";
import {
  Animated,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { useToast } from "@/app/utils/common";
import OTPscreen from "@/components/OTPscreen";
import { useTheme } from "@/context/ThemeContext";
import { VibrationManager } from "@/utils/Vibrate";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";

const ForgotPasswordScreen = () => {
  const [currentStep, setCurrentStep] = useState<
    "email" | "verification" | "reset"
  >("email");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [floatingElements] = useState([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]);
  const [logoScale] = useState(new Animated.Value(1));
  const [cardScale] = useState(new Animated.Value(0.95));
  const [buttonPulse] = useState(new Animated.Value(1));

  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const navigation = useNavigation();
  const router = useRouter();
  const { toastVisible, toastMessage, toastAnim, showToast } = useToast();

  // Custom forgot password state
  const [isLoaded, setIsLoaded] = useState(true);

  // Form states
  const [email, setEmail] = useState("");
  const [resetForm, setResetForm] = useState({
    password: "",
    confirmPassword: "",
  });

  // Validation states
  const [passwordError, setPasswordError] = useState("");
  const [focusedInput, setFocusedInput] = useState("");

  // Floating animation effect
  useEffect(() => {
    const animations = floatingElements.map((anim, index) => {
      return Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {
            toValue: 1,
            duration: 3000 + index * 500,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 3000 + index * 500,
            useNativeDriver: true,
          }),
        ])
      );
    });

    animations.forEach((anim) => anim.start());

    // Logo pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(logoScale, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Card entrance animation
    Animated.spring(cardScale, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();

    return () => {
      animations.forEach((anim) => anim.stop());
    };
  }, []);

  // Button pulse animation
  useEffect(() => {
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(buttonPulse, {
          toValue: 1.02,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(buttonPulse, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();

    return () => pulseAnimation.stop();
  }, []);

  // Keyboard event listeners
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      (e) => setKeyboardHeight(e.endCoordinates.height)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => setKeyboardHeight(0)
    );

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  // Validation functions
  const validatePasswords = (password: string, confirmPassword: string) => {
    if (confirmPassword && password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return false;
    } else {
      setPasswordError("");
      return true;
    }
  };

  const isEmailValid = () => {
    return email.trim() !== "" && email.includes("@");
  };

  const isResetFormValid = () => {
    const { password, confirmPassword } = resetForm;
    return (
      password.trim() !== "" &&
      confirmPassword.trim() !== "" &&
      password === confirmPassword &&
      password.length >= 6
    );
  };

  const handleSendResetEmail = async () => {
    if (!isLoaded || !isEmailValid()) return;

    setIsVerifying(true);
    try {
      // Custom password reset request - replace with your API call
      // await yourService.sendPasswordResetEmail(email);

      // For now, just simulate success
      VibrationManager.success();
      showToast("Password reset code sent to your email!");
      setCurrentStep("verification");
    } catch (err: any) {
      VibrationManager.error();

      let errorMessage = "Failed to send reset email. Please try again.";
      if (err?.message) {
        errorMessage = err.message;
      }

      showToast(errorMessage);
    } finally {
      setIsVerifying(false);
    }
  };

  const onVerifyResetCode = async (otpArr: string[]) => {
    const otp = otpArr?.join("");
    if (!isLoaded || isVerifying) return;

    if (!otp?.length) {
      VibrationManager.error();
      showToast(`Please enter a valid verification code`);
      return;
    }

    setIsVerifying(true);
    try {
      // Custom OTP verification - replace with your API call
      // await yourService.verifyResetCode(email, otp);

      // For now, just simulate success
      VibrationManager.success();
      showToast("Code verified! Please set your new password.");
      setCurrentStep("reset");
    } catch (err: any) {
      VibrationManager.error();

      let errorMessage = "Invalid verification code. Please try again.";
      if (err?.errors?.[0]?.message) {
        errorMessage = err.errors[0].message;
      } else if (err?.message) {
        errorMessage = err.message;
      }

      showToast(errorMessage);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResetPassword = async () => {
    if (!isLoaded || !isResetFormValid()) return;

    setIsResetting(true);
    try {
      // Custom password reset - replace with your API call
      // await yourService.resetPassword(email, resetForm.password);

      // For now, just simulate success
      VibrationManager.success();
      showToast(
        "Password reset successful! You can now sign in with your new password."
      );
      router.push("/auth/login");
    } catch (err: any) {
      VibrationManager.error();

      let errorMessage = "Failed to reset password. Please try again.";
      if (err?.errors?.[0]?.message) {
        errorMessage = err.errors[0].message;
      } else if (err?.message) {
        errorMessage = err.message;
      }

      showToast(errorMessage);
    } finally {
      setIsResetting(false);
    }
  };

  const goBack = () => {
    if (currentStep === "email") {
      router.back();
    } else if (currentStep === "verification") {
      setCurrentStep("email");
    } else if (currentStep === "reset") {
      setCurrentStep("verification");
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case "email":
        return "Reset Password";
      case "verification":
        return "Verify Code";
      case "reset":
        return "New Password";
      default:
        return "Reset Password";
    }
  };

  const getStepSubtitle = () => {
    switch (currentStep) {
      case "email":
        return "Enter your email to receive a reset code";
      case "verification":
        return "Enter the 6-digit code sent to your email";
      case "reset":
        return "Create a new secure password";
      default:
        return "";
    }
  };

  useEffect(() => {
    if (navigation && typeof navigation.setOptions === "function") {
      navigation.setOptions({ title: "" });
    }
  }, [navigation]);

  if (currentStep === "verification") {
    return (
      <OTPscreen
        totalInput={6}
        onSubmit={(otp) => {
          onVerifyResetCode(otp);
        }}
        successMessage="yes"
        isVerifying={isVerifying}
        goBack={goBack}
      />
    );
  }

  const FloatingElement = ({
    index,
    size = 20,
    color = "rgba(255,255,255,0.1)",
  }: any) => (
    <Animated.View
      style={[
        styles.floatingElement,
        {
          width: size,
          height: size,
          backgroundColor: color,
          transform: [
            {
              translateY: floatingElements[index]?.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -50],
              }),
            },
            {
              translateX: floatingElements[index]?.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 30 * (index % 2 === 0 ? 1 : -1)],
              }),
            },
          ],
          opacity: floatingElements[index]?.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0.3, 1, 0.3],
          }),
        },
      ]}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <LinearGradient
        colors={[
          theme.accent + "20",
          theme.accent + "10",
          theme.background + "F0",
          theme.background,
        ]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        locations={[0, 0.3, 0.7, 1]}
      >
        {/* Floating Background Elements */}
        <View style={styles.floatingContainer}>
          <FloatingElement index={0} size={60} color={theme.accent + "15"} />
          <FloatingElement index={1} size={40} color={theme.accent + "20"} />
          <FloatingElement index={2} size={80} color={theme.accent + "10"} />
          <FloatingElement index={3} size={30} color={theme.accent + "25"} />
        </View>

        <KeyboardAvoidingView
          behavior={"position"}
          style={styles.keyboardAvoidingView}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
          <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            accessible={false}
          >
            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              bounces={false}
            >
              {/* Back Button */}
              <TouchableOpacity
                style={styles.backButton}
                onPress={goBack}
                activeOpacity={0.7}
              >
                <Ionicons name="arrow-back" size={24} color={theme.text} />
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>

              {/* Logo and Welcome Section */}
              <Animated.View
                style={[
                  styles.logoContainer,
                  { transform: [{ scale: logoScale }] },
                ]}
              >
                <Text style={styles.appName}>Bhakti App</Text>
                <Text style={styles.welcomeTitle}>{getStepTitle()}</Text>
                <Text style={styles.welcomeSubtitle}>{getStepSubtitle()}</Text>
              </Animated.View>

              {/* Reset Card */}
              <Animated.View
                style={[styles.authCard, { transform: [{ scale: cardScale }] }]}
              >
                <LinearGradient
                  colors={["rgba(255,255,255,0.95)", "rgba(255,255,255,0.85)"]}
                  style={styles.cardGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  {/* Form Content */}
                  <View style={styles.formContainer}>
                    {currentStep === "email" ? (
                      // Email Form
                      <View style={styles.form}>
                        <View
                          style={[
                            styles.inputContainer,
                            focusedInput === "email" && styles.inputFocused,
                          ]}
                        >
                          <LinearGradient
                            colors={["rgba(0,0,0,0.02)", "rgba(0,0,0,0.01)"]}
                            style={styles.inputGradient}
                          >
                            <Ionicons
                              name="mail-outline"
                              size={22}
                              color={
                                focusedInput === "email"
                                  ? theme.accent
                                  : theme.text
                              }
                              style={styles.inputIcon}
                            />
                            <TextInput
                              style={styles.input}
                              placeholder="Enter your email address"
                              placeholderTextColor="#999"
                              value={email}
                              onChangeText={setEmail}
                              onFocus={() => setFocusedInput("email")}
                              onBlur={() => setFocusedInput("")}
                              keyboardType="email-address"
                              autoCapitalize="none"
                            />
                          </LinearGradient>
                        </View>

                        <Animated.View
                          style={{ transform: [{ scale: buttonPulse }] }}
                        >
                          <TouchableOpacity
                            style={[
                              styles.primaryButton,
                              !isEmailValid() && styles.disabledButton,
                            ]}
                            onPress={handleSendResetEmail}
                            disabled={!isEmailValid() || isVerifying}
                            activeOpacity={0.8}
                          >
                            <LinearGradient
                              colors={
                                !isEmailValid()
                                  ? ["#E0E0E0", "#BDBDBD"]
                                  : [theme.accent, theme.accent + "CC"]
                              }
                              style={styles.buttonGradient}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 0 }}
                            >
                              {isVerifying ? (
                                <Text style={styles.buttonText}>
                                  Sending Code...
                                </Text>
                              ) : (
                                <>
                                  <Text style={styles.buttonText}>
                                    Send Reset Code
                                  </Text>
                                  <Ionicons
                                    name="arrow-forward"
                                    size={20}
                                    color="white"
                                    style={styles.buttonIcon}
                                  />
                                </>
                              )}
                            </LinearGradient>
                          </TouchableOpacity>
                        </Animated.View>
                      </View>
                    ) : (
                      // New Password Form
                      <View style={styles.form}>
                        <View
                          style={[
                            styles.inputContainer,
                            focusedInput === "password" && styles.inputFocused,
                          ]}
                        >
                          <LinearGradient
                            colors={["rgba(0,0,0,0.02)", "rgba(0,0,0,0.01)"]}
                            style={styles.inputGradient}
                          >
                            <Ionicons
                              name="lock-closed-outline"
                              size={22}
                              color={
                                focusedInput === "password"
                                  ? theme.accent
                                  : theme.text
                              }
                              style={styles.inputIcon}
                            />
                            <TextInput
                              style={styles.input}
                              placeholder="Enter new password"
                              placeholderTextColor="#999"
                              value={resetForm.password}
                              onChangeText={(text) => {
                                const newForm = {
                                  ...resetForm,
                                  password: text,
                                };
                                setResetForm(newForm);
                                if (newForm.confirmPassword) {
                                  validatePasswords(
                                    text,
                                    newForm.confirmPassword
                                  );
                                }
                              }}
                              onFocus={() => setFocusedInput("password")}
                              onBlur={() => setFocusedInput("")}
                              secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity
                              onPress={() => setShowPassword(!showPassword)}
                              style={styles.eyeIcon}
                              activeOpacity={0.7}
                            >
                              <Ionicons
                                name={
                                  showPassword
                                    ? "eye-outline"
                                    : "eye-off-outline"
                                }
                                size={22}
                                color={theme.accent}
                              />
                            </TouchableOpacity>
                          </LinearGradient>
                        </View>

                        <View
                          style={[
                            styles.inputContainer,
                            focusedInput === "confirmPassword" &&
                              styles.inputFocused,
                          ]}
                        >
                          <LinearGradient
                            colors={["rgba(0,0,0,0.02)", "rgba(0,0,0,0.01)"]}
                            style={styles.inputGradient}
                          >
                            <Ionicons
                              name="checkmark-circle-outline"
                              size={22}
                              color={
                                focusedInput === "confirmPassword"
                                  ? theme.accent
                                  : theme.text
                              }
                              style={styles.inputIcon}
                            />
                            <TextInput
                              style={styles.input}
                              placeholder="Confirm new password"
                              placeholderTextColor="#999"
                              value={resetForm.confirmPassword}
                              onChangeText={(text) => {
                                const newForm = {
                                  ...resetForm,
                                  confirmPassword: text,
                                };
                                setResetForm(newForm);
                                validatePasswords(newForm.password, text);
                              }}
                              onFocus={() => setFocusedInput("confirmPassword")}
                              onBlur={() => setFocusedInput("")}
                              secureTextEntry={!showConfirmPassword}
                            />
                            <TouchableOpacity
                              onPress={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              style={styles.eyeIcon}
                              activeOpacity={0.7}
                            >
                              <Ionicons
                                name={
                                  showConfirmPassword
                                    ? "eye-outline"
                                    : "eye-off-outline"
                                }
                                size={22}
                                color={theme.accent}
                              />
                            </TouchableOpacity>
                          </LinearGradient>
                        </View>

                        {passwordError ? (
                          <View style={styles.errorContainer}>
                            <Ionicons
                              name="alert-circle"
                              size={16}
                              color="#FF6B6B"
                            />
                            <Text style={styles.errorText}>
                              {passwordError}
                            </Text>
                          </View>
                        ) : null}

                        <Animated.View
                          style={{ transform: [{ scale: buttonPulse }] }}
                        >
                          <TouchableOpacity
                            style={[
                              styles.primaryButton,
                              !isResetFormValid() && styles.disabledButton,
                            ]}
                            onPress={handleResetPassword}
                            disabled={!isResetFormValid() || isResetting}
                            activeOpacity={0.8}
                          >
                            <LinearGradient
                              colors={
                                !isResetFormValid()
                                  ? ["#E0E0E0", "#BDBDBD"]
                                  : [theme.accent, theme.accent + "CC"]
                              }
                              style={styles.buttonGradient}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 0 }}
                            >
                              {isResetting ? (
                                <Text style={styles.buttonText}>
                                  Resetting Password...
                                </Text>
                              ) : (
                                <>
                                  <Text style={styles.buttonText}>
                                    Reset Password
                                  </Text>
                                  <Ionicons
                                    name="checkmark"
                                    size={20}
                                    color="white"
                                    style={styles.buttonIcon}
                                  />
                                </>
                              )}
                            </LinearGradient>
                          </TouchableOpacity>
                        </Animated.View>
                      </View>
                    )}
                  </View>
                </LinearGradient>
              </Animated.View>

              {/* Bottom spacing */}
              <View style={styles.bottomSpacer} />
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>

        {/* Enhanced Toast Notification */}
        {toastVisible && (
          <Animated.View
            style={[
              styles.toastContainer,
              {
                bottom: keyboardHeight > 0 ? keyboardHeight + 20 : 60,
                transform: [
                  {
                    translateY: toastAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [40, 0],
                    }),
                  },
                  {
                    scale: toastAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1],
                    }),
                  },
                ],
                opacity: toastAnim,
              },
            ]}
          >
            <LinearGradient
              colors={[theme.text, theme.text + "E6"]}
              style={styles.toastGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Ionicons name="checkmark-circle" size={20} color="white" />
              <Text style={styles.toastText}>{toastMessage}</Text>
            </LinearGradient>
          </Animated.View>
        )}
      </LinearGradient>
    </SafeAreaView>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    gradient: {
      flex: 1,
    },
    floatingContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 0,
    },
    floatingElement: {
      position: "absolute",
      borderRadius: 50,
    },
    keyboardAvoidingView: {
      flex: 1,
      zIndex: 1,
    },
    backButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingTop: 40,
      paddingLeft: 20,
      paddingVertical: 15,
    },
    backButtonText: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.text,
      marginLeft: 8,
    },
    logoContainer: {
      alignItems: "center",
      marginBottom: 40,
      paddingTop: 20,
    },
    appName: {
      fontSize: 32,
      fontWeight: "800",
      color: theme.text,
      marginBottom: 8,
      letterSpacing: -0.5,
      textShadowColor: "rgba(0, 0, 0, 0.1)",
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 4,
    },
    welcomeTitle: {
      fontSize: 24,
      fontWeight: "700",
      color: theme.text,
      marginBottom: 8,
      textAlign: "center",
    },
    welcomeSubtitle: {
      fontSize: 16,
      color: theme.text,
      fontWeight: "500",
      textAlign: "center",
      opacity: 0.8,
    },
    authCard: {
      borderRadius: 30,
      marginBottom: 20,
      marginHorizontal: 20,
      shadowColor: theme.text,
      shadowOffset: { width: 0, height: 25 },
      shadowOpacity: 0.15,
      shadowRadius: 40,
      elevation: 25,
      overflow: "hidden",
    },
    cardGradient: {
      padding: 30,
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.3)",
    },
    formContainer: {
      paddingHorizontal: 0,
    },
    form: {
      marginBottom: 10,
    },
    inputContainer: {
      marginBottom: 20,
      borderRadius: 20,
      shadowColor: "rgba(0,0,0,0.1)",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 12,
      elevation: 5,
    },
    inputGradient: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 20,
      minHeight: 60,
      borderWidth: 2,
      borderColor: "rgba(0,0,0,0.08)",
      borderRadius: 20,
      backgroundColor: "white",
    },
    inputFocused: {
      shadowColor: theme.accent,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.3,
      shadowRadius: 15,
      elevation: 8,
      transform: [{ scale: 1.02 }],
    },
    inputIcon: {
      marginRight: 16,
      opacity: 0.8,
    },
    input: {
      flex: 1,
      fontSize: 16,
      color: theme.text,
      fontWeight: "500",
      paddingVertical: 0,
    },
    eyeIcon: {
      padding: 10,
      borderRadius: 20,
      marginLeft: 8,
    },
    errorContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 20,
      marginTop: -16,
      paddingHorizontal: 20,
      paddingVertical: 12,
      backgroundColor: "rgba(255, 107, 107, 0.1)",
      borderRadius: 15,
      borderWidth: 1,
      borderColor: "rgba(255, 107, 107, 0.2)",
    },
    errorText: {
      color: "#FF6B6B",
      fontSize: 14,
      marginLeft: 8,
      fontWeight: "500",
      flex: 1,
    },
    primaryButton: {
      borderRadius: 25,
      overflow: "hidden",
      marginBottom: 16,
      shadowColor: theme.accent,
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.4,
      shadowRadius: 25,
      elevation: 15,
    },
    buttonGradient: {
      paddingVertical: 18,
      paddingHorizontal: 30,
      alignItems: "center",
      justifyContent: "center",
      minHeight: 60,
      flexDirection: "row",
    },
    buttonText: {
      color: "white",
      fontSize: 17,
      fontWeight: "700",
      letterSpacing: 0.5,
      textShadowColor: "rgba(0,0,0,0.3)",
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    },
    buttonIcon: {
      marginLeft: 10,
    },
    bottomSpacer: {
      height: 100,
    },
    toastContainer: {
      position: "absolute",
      left: 20,
      right: 20,
      borderRadius: 20,
      overflow: "hidden",
      shadowColor: theme.text,
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.5,
      shadowRadius: 25,
      elevation: 15,
    },
    toastGradient: {
      paddingVertical: 18,
      paddingHorizontal: 24,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    toastText: {
      color: "white",
      fontSize: 15,
      fontWeight: "600",
      textAlign: "center",
      marginLeft: 8,
      flex: 1,
    },
    disabledButton: {
      opacity: 0.6,
      elevation: 5,
      shadowOpacity: 0.2,
      transform: [{ scale: 0.98 }],
    },
  });

export default ForgotPasswordScreen;

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo, useState } from "react";
import {
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useToast } from "@/app/utils/common";
import OTPscreen from "@/components/OTPscreen";
import { useTheme } from "@/context/ThemeContext";
import { VibrationManager } from "@/utils/Vibrate";
import { useSignIn, useSignUp } from "@clerk/clerk-expo";
import { useLocalSearchParams, useRouter } from "expo-router";

const { width } = Dimensions.get("window");

const AuthScreen = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [animatedValue] = useState(new Animated.Value(0));
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const router = useRouter();
  const params = useLocalSearchParams();
  const returnTo = params.returnTo as string;
  const { toastVisible, toastMessage, toastAnim, showToast } = useToast();

  const { isLoaded, signUp, setActive } = useSignUp();
  const {
    isLoaded: signInLoaded,
    signIn,
    setActive: setSignInActive,
  } = useSignIn();

  // Form states
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Validation states
  const [passwordError, setPasswordError] = useState("");

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

  const isSignupFormValid = () => {
    const { name, email, password, confirmPassword } = signupForm;
    return (
      name.trim() !== "" &&
      email.trim() !== "" &&
      password.trim() !== "" &&
      confirmPassword.trim() !== "" &&
      password === confirmPassword
    );
  };

  const isLoginFormValid = () => {
    const { email, password } = loginForm;
    return email.trim() !== "" && password.trim() !== "";
  };

  const switchTab = (tab: string) => {
    setActiveTab(tab);
    // Reset validation errors when switching tabs
    setPasswordError("");
    Animated.spring(animatedValue, {
      toValue: tab === "login" ? 0 : 1,
      useNativeDriver: false,
      tension: 100,
      friction: 8,
    }).start();
  };

  const handleLogin = async () => {
    if (!signInLoaded || !isLoginFormValid()) return;

    try {
      const result = await signIn.create({
        identifier: loginForm.email,
        password: loginForm.password,
      });

      if (result.status === "complete") {
        VibrationManager.success();
        showToast("Login successful!");

        await setSignInActive({ session: result.createdSessionId });

        // Navigate back to the return URL or home
        if (returnTo) {
          router.push(returnTo as any);
        } else {
          router.push("/");
        }
      }
    } catch (err: any) {
      console.error("Login error:", JSON.stringify(err, null, 2));
      VibrationManager.error();

      // Extract user-friendly error message
      let errorMessage = "Login failed. Please check your credentials.";
      if (err?.errors?.[0]?.message) {
        errorMessage = err.errors[0].message;
      } else if (err?.message) {
        errorMessage = err.message;
      }

      showToast(errorMessage);
    }
  };

  const handleSignup = async () => {
    if (!isLoaded || !isSignupFormValid()) return;

    try {
      await signUp.create({
        emailAddress: signupForm.email,
        password: signupForm.password,
        firstName: signupForm.name,
      });

      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      setPendingVerification(true);
      VibrationManager.success();
      showToast("Verification code sent to your email!");
    } catch (err: any) {
      console.error("Signup error:", JSON.stringify(err, null, 2));
      VibrationManager.error();

      // Extract user-friendly error message
      let errorMessage = "Failed to create account. Please try again.";
      if (err?.errors?.[0]?.message) {
        errorMessage = err.errors[0].message;
      } else if (err?.message) {
        errorMessage = err.message;
      }

      showToast(errorMessage);
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded || isVerifying) return;

    // Validate code input
    if (!code || code.length < 6) {
      VibrationManager.error();
      showToast("Please enter a valid 6-digit verification code");
      return;
    }
    setIsVerifying(true);
    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (signUpAttempt.status === "complete") {
        VibrationManager.success();
        showToast("Email verified successfully!");
        await setActive({ session: signUpAttempt.createdSessionId });
        if (returnTo) {
          router.push(returnTo as any);
        } else {
          router.push("/");
        }
      } else {
        VibrationManager.error();
        console.error(
          "Verification incomplete:",
          JSON.stringify(signUpAttempt, null, 2)
        );

        // Handle incomplete verification
        let errorMessage = "Verification failed. Please try again.";
        if ((signUpAttempt as any)?.errors?.[0]?.message) {
          errorMessage = (signUpAttempt as any).errors[0].message;
        }
        showToast(errorMessage);
      }
    } catch (err: any) {
      VibrationManager.error();
      console.error("Verification error:", JSON.stringify(err, null, 2));

      // Extract user-friendly error message
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

  const tabIndicatorStyle = {
    transform: [
      {
        translateX: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0, width * 0.4],
        }),
      },
    ],
  };

  if (pendingVerification) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={[theme.accent, theme.background]}
          style={styles.gradient}
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
                We sent you a 6-digit code to verify your email.
              </Text>
            </View>

            <View style={styles.authCard}>
              <View style={styles.formContainer}>
                <View style={styles.form}>
                  <View style={styles.inputContainer}>
                    <Ionicons
                      name="key-outline"
                      size={20}
                      color="#666"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter verification code"
                      placeholderTextColor="#999"
                      value={code}
                      onChangeText={(text) => setCode(text)}
                      keyboardType="number-pad"
                      autoCapitalize="none"
                    />
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
                        {isVerifying ? "Verifying..." : "Verify Email"}
                      </Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
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
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[theme.accent, theme.background]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.welcomeText}>Welcome</Text>
            <OTPscreen
              totalInput={8}
              onSubmit={() => {}}
              successMessage="yes"
            />
            <Text style={styles.subtitleText}>
              {returnTo ? "Sign in to book your puja" : "Sign in to continue"}
            </Text>
          </View>

          {/* Auth Card */}
          <View style={styles.authCard}>
            {/* Tab Headers */}
            <View style={styles.tabContainer}>
              <Animated.View style={[styles.tabIndicator, tabIndicatorStyle]} />
              <TouchableOpacity
                style={styles.tab}
                onPress={() => switchTab("login")}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === "login" && styles.activeTabText,
                  ]}
                >
                  Login
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.tab}
                onPress={() => switchTab("signup")}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === "signup" && styles.activeTabText,
                  ]}
                >
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>

            {/* Form Content */}
            <View style={styles.formContainer}>
              {activeTab === "login" ? (
                // Login Form
                <View style={styles.form}>
                  <View style={styles.inputContainer}>
                    <Ionicons
                      name="mail-outline"
                      size={20}
                      color="#666"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Email id"
                      placeholderTextColor="#999"
                      value={loginForm.email}
                      onChangeText={(text) =>
                        setLoginForm({ ...loginForm, email: text })
                      }
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Ionicons
                      name="lock-closed-outline"
                      size={20}
                      color="#666"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Password"
                      placeholderTextColor="#999"
                      value={loginForm.password}
                      onChangeText={(text) =>
                        setLoginForm({ ...loginForm, password: text })
                      }
                      secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.eyeIcon}
                    >
                      <Ionicons
                        name={showPassword ? "eye-outline" : "eye-off-outline"}
                        size={20}
                        color="#666"
                      />
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity style={styles.forgotPassword}>
                    <Text style={styles.forgotPasswordText}>
                      Forgot Password?
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.primaryButton,
                      !isLoginFormValid() && styles.disabledButton,
                    ]}
                    onPress={handleLogin}
                    disabled={!isLoginFormValid()}
                  >
                    <LinearGradient
                      colors={
                        !isLoginFormValid()
                          ? [theme.cardBorder, theme.cardBorder]
                          : [theme.accent, theme.accent]
                      }
                      style={styles.buttonGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      <Text style={styles.buttonText}>Login</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              ) : (
                // Signup Form
                <View style={styles.form}>
                  <View style={styles.inputContainer}>
                    <Ionicons
                      name="person-outline"
                      size={20}
                      color="#666"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Full Name"
                      placeholderTextColor="#999"
                      value={signupForm.name}
                      onChangeText={(text) =>
                        setSignupForm({ ...signupForm, name: text })
                      }
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Ionicons
                      name="mail-outline"
                      size={20}
                      color="#666"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Email"
                      placeholderTextColor="#999"
                      value={signupForm.email}
                      onChangeText={(text) =>
                        setSignupForm({ ...signupForm, email: text })
                      }
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Ionicons
                      name="lock-closed-outline"
                      size={20}
                      color="#666"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Password"
                      placeholderTextColor="#999"
                      value={signupForm.password}
                      onChangeText={(text) => {
                        const newForm = { ...signupForm, password: text };
                        setSignupForm(newForm);
                        // Validate passwords if confirm password is already filled
                        if (newForm.confirmPassword) {
                          validatePasswords(text, newForm.confirmPassword);
                        }
                      }}
                      secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.eyeIcon}
                    >
                      <Ionicons
                        name={showPassword ? "eye-outline" : "eye-off-outline"}
                        size={20}
                        color="#666"
                      />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.inputContainer}>
                    <Ionicons
                      name="lock-closed-outline"
                      size={20}
                      color="#666"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Confirm Password"
                      placeholderTextColor="#999"
                      value={signupForm.confirmPassword}
                      onChangeText={(text) => {
                        const newForm = {
                          ...signupForm,
                          confirmPassword: text,
                        };
                        setSignupForm(newForm);
                        // Validate passwords
                        validatePasswords(newForm.password, text);
                      }}
                      secureTextEntry={!showConfirmPassword}
                    />
                    <TouchableOpacity
                      onPress={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      style={styles.eyeIcon}
                    >
                      <Ionicons
                        name={
                          showConfirmPassword
                            ? "eye-outline"
                            : "eye-off-outline"
                        }
                        size={20}
                        color="#666"
                      />
                    </TouchableOpacity>
                  </View>

                  {/* Password Error Message */}
                  {passwordError ? (
                    <View style={styles.errorContainer}>
                      <Text style={styles.errorText}>{passwordError}</Text>
                    </View>
                  ) : null}

                  <TouchableOpacity
                    style={[
                      styles.primaryButton,
                      !isSignupFormValid() && styles.disabledButton,
                    ]}
                    onPress={handleSignup}
                    disabled={!isSignupFormValid()}
                  >
                    <LinearGradient
                      colors={
                        !isSignupFormValid()
                          ? [theme.cardBorder, theme.cardBorder]
                          : [theme.accent, theme.accent]
                      }
                      style={styles.buttonGradient}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    >
                      <Text style={styles.buttonText}>Sign Up</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              )}
            </View>
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
      flex: 1,
      backgroundColor: theme.background,
    },
    gradient: {
      flex: 1,
    },
    keyboardView: {
      flex: 1,
      justifyContent: "center",
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
    tabContainer: {
      flexDirection: "row",
      position: "relative",
      marginBottom: 30,
    },
    tabIndicator: {
      position: "absolute",
      bottom: 0,
      height: 3,
      width: width * 0.4,
      backgroundColor: theme.accent,
      borderRadius: 2,
    },
    tab: {
      flex: 1,
      paddingVertical: 15,
      alignItems: "center",
    },
    tabText: {
      fontSize: 16,
      fontWeight: "500",
      color: theme.text,
    },
    activeTabText: {
      color: theme.accent,
      fontWeight: "600",
    },
    formContainer: {
      paddingHorizontal: 20,
    },
    form: {
      marginBottom: 20,
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      borderWidth: 2,
      borderColor: theme.cardBorder,
      borderRadius: 12,
      marginBottom: 16,
      paddingHorizontal: 15,
      backgroundColor: theme.background,
      elevation: 2,
      shadowColor: theme.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    inputIcon: {
      marginRight: 12,
    },
    input: {
      flex: 1,
      height: 50,
      fontSize: 16,
      color: theme.text,
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
    socialContainer: {
      paddingHorizontal: 20,
      paddingBottom: 20,
    },
    divider: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 20,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: theme.cardBorder,
    },
    dividerText: {
      marginHorizontal: 15,
      color: theme.text,
      fontSize: 14,
      opacity: 0.6,
    },
    socialButtons: {
      flexDirection: "row",
      justifyContent: "center",
      gap: 15,
    },
    socialButton: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: theme.background,
      justifyContent: "center",
      alignItems: "center",
      borderWidth: 1,
      borderColor: theme.cardBorder,
      elevation: 2,
      shadowColor: theme.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
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

export default AuthScreen;

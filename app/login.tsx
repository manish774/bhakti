import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useMemo, useState } from "react";
import {
  Animated,
  BackHandler,
  Dimensions,
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
import { useSignIn, useSignUp } from "@clerk/clerk-expo";
import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");

const AuthScreen = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [animatedValue] = useState(new Animated.Value(0));
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
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const navigation = useNavigation();
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
    setPasswordError("");
    setFocusedInput("");
    Animated.spring(animatedValue, {
      toValue: tab === "login" ? 0 : 1,
      useNativeDriver: false,
      tension: 100,
      friction: 8,
    }).start();
  };

  useEffect(() => {
    const backAction = () => {
      return true; // prevent default back action
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

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

        if (returnTo) {
          router.push("/Home/Home");
        } else {
          router.push("/");
        }
      }
    } catch (err: any) {
      VibrationManager.error();

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
      VibrationManager.error();

      let errorMessage = "Failed to create account. Please try again.";
      if (err?.errors?.[0]?.message) {
        errorMessage = err.errors[0].message;
      } else if (err?.message) {
        errorMessage = err.message;
      }

      showToast(errorMessage);
    }
  };

  const onVerifyPress = async (otpArr: string[]) => {
    const otp = otpArr?.join("");
    if (!isLoaded || isVerifying) return;

    if (!otp?.length) {
      VibrationManager.error();
      showToast(`Please enter a valid verification code`);
      return;
    }
    setIsVerifying(true);
    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code: otp,
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

        let errorMessage = "Verification failed. Please try again.";
        if ((signUpAttempt as any)?.errors?.[0]?.message) {
          errorMessage = (signUpAttempt as any).errors[0].message;
        }
        showToast(errorMessage);
      }
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

  const handleForgotPassword = () => {
    router.push("/ForgotPassword");
  };

  const tabIndicatorStyle = {
    transform: [
      {
        translateX: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0, (width - 100) / 2], // Fixed calculation
        }),
      },
    ],
  };

  useEffect(() => {
    if (navigation && typeof navigation.setOptions === "function") {
      navigation.setOptions({ title: "" });
    }
  }, [navigation]);

  if (pendingVerification) {
    return (
      <OTPscreen
        totalInput={6}
        onSubmit={(otp) => {
          onVerifyPress(otp);
        }}
        successMessage="yes"
        isVerifying={isVerifying}
        goBack={() => {
          setPendingVerification(false);
        }}
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
              {/* Logo and Welcome Section */}
              <Animated.View
                style={[
                  styles.logoContainer,
                  { transform: [{ scale: logoScale }] },
                ]}
              >
                <Text style={styles.appName}>Bhakti App</Text>
                <Text style={styles.welcomeSubtitle}>
                  {activeTab === "login"
                    ? "Welcome back!"
                    : "Join our spiritual journey"}
                </Text>
              </Animated.View>

              {/* Auth Card */}
              <Animated.View
                style={[styles.authCard, { transform: [{ scale: cardScale }] }]}
              >
                <LinearGradient
                  colors={["rgba(255,255,255,0.95)", "rgba(255,255,255,0.85)"]}
                  style={styles.cardGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  {/* Enhanced Tab Container */}
                  <View style={styles.tabContainer}>
                    <Animated.View
                      style={[styles.tabIndicator, tabIndicatorStyle]}
                    />
                    <TouchableOpacity
                      style={styles.tab}
                      onPress={() => switchTab("login")}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name="log-in-outline"
                        size={20}
                        color={
                          activeTab === "login" ? "white" : theme.text + "80"
                        }
                        style={styles.tabIcon}
                      />
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
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name="person-add-outline"
                        size={20}
                        color={
                          activeTab === "signup" ? "white" : theme.text + "80"
                        }
                        style={styles.tabIcon}
                      />
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
                      // Enhanced Login Form
                      <View style={styles.form}>
                        <View
                          style={[
                            styles.inputContainer,
                            focusedInput === "loginEmail" &&
                              styles.inputFocused,
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
                                focusedInput === "loginEmail"
                                  ? theme.accent
                                  : theme.text
                              }
                              style={styles.inputIcon}
                            />
                            <TextInput
                              style={styles.input}
                              placeholder="Enter your email"
                              placeholderTextColor="#999"
                              value={loginForm.email}
                              onChangeText={(text) =>
                                setLoginForm({ ...loginForm, email: text })
                              }
                              onFocus={() => setFocusedInput("loginEmail")}
                              onBlur={() => setFocusedInput("")}
                              keyboardType="email-address"
                              autoCapitalize="none"
                            />
                          </LinearGradient>
                        </View>

                        <View
                          style={[
                            styles.inputContainer,
                            focusedInput === "loginPassword" &&
                              styles.inputFocused,
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
                                focusedInput === "loginPassword"
                                  ? theme.accent
                                  : theme.text
                              }
                              style={styles.inputIcon}
                            />
                            <TextInput
                              style={styles.input}
                              placeholder="Enter your password"
                              placeholderTextColor="#999"
                              value={loginForm.password}
                              onChangeText={(text) =>
                                setLoginForm({ ...loginForm, password: text })
                              }
                              onFocus={() => setFocusedInput("loginPassword")}
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

                        <TouchableOpacity
                          style={styles.forgotPassword}
                          onPress={handleForgotPassword}
                          activeOpacity={0.7}
                        >
                          <Text style={styles.forgotPasswordText}>
                            Forgot your password?
                          </Text>
                        </TouchableOpacity>

                        <Animated.View
                          style={{ transform: [{ scale: buttonPulse }] }}
                        >
                          <TouchableOpacity
                            style={[
                              styles.primaryButton,
                              !isLoginFormValid() && styles.disabledButton,
                            ]}
                            onPress={handleLogin}
                            disabled={!isLoginFormValid()}
                            activeOpacity={0.8}
                          >
                            <LinearGradient
                              colors={
                                !isLoginFormValid()
                                  ? ["#E0E0E0", "#BDBDBD"]
                                  : [theme.accent, theme.accent + "CC"]
                              }
                              style={styles.buttonGradient}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 0 }}
                            >
                              <Text style={styles.buttonText}>
                                Sign In to Continue
                              </Text>
                              <Ionicons
                                name="arrow-forward"
                                size={20}
                                color="white"
                                style={styles.buttonIcon}
                              />
                            </LinearGradient>
                          </TouchableOpacity>
                        </Animated.View>
                      </View>
                    ) : (
                      // Enhanced Signup Form
                      <View style={styles.form}>
                        <View
                          style={[
                            styles.inputContainer,
                            focusedInput === "signupName" &&
                              styles.inputFocused,
                          ]}
                        >
                          <LinearGradient
                            colors={["rgba(0,0,0,0.02)", "rgba(0,0,0,0.01)"]}
                            style={styles.inputGradient}
                          >
                            <Ionicons
                              name="person-outline"
                              size={22}
                              color={
                                focusedInput === "signupName"
                                  ? theme.accent
                                  : theme.text
                              }
                              style={styles.inputIcon}
                            />
                            <TextInput
                              style={styles.input}
                              placeholder="Enter your full name"
                              placeholderTextColor="#999"
                              value={signupForm.name}
                              onChangeText={(text) =>
                                setSignupForm({ ...signupForm, name: text })
                              }
                              onFocus={() => setFocusedInput("signupName")}
                              onBlur={() => setFocusedInput("")}
                            />
                          </LinearGradient>
                        </View>

                        <View
                          style={[
                            styles.inputContainer,
                            focusedInput === "signupEmail" &&
                              styles.inputFocused,
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
                                focusedInput === "signupEmail"
                                  ? theme.accent
                                  : theme.text
                              }
                              style={styles.inputIcon}
                            />
                            <TextInput
                              style={styles.input}
                              placeholder="Enter your email"
                              placeholderTextColor="#999"
                              value={signupForm.email}
                              onChangeText={(text) =>
                                setSignupForm({ ...signupForm, email: text })
                              }
                              onFocus={() => setFocusedInput("signupEmail")}
                              onBlur={() => setFocusedInput("")}
                              keyboardType="email-address"
                              autoCapitalize="none"
                            />
                          </LinearGradient>
                        </View>

                        <View
                          style={[
                            styles.inputContainer,
                            focusedInput === "signupPassword" &&
                              styles.inputFocused,
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
                                focusedInput === "signupPassword"
                                  ? theme.accent
                                  : theme.text
                              }
                              style={styles.inputIcon}
                            />
                            <TextInput
                              style={styles.input}
                              placeholder="Create password"
                              placeholderTextColor="#999"
                              value={signupForm.password}
                              onChangeText={(text) => {
                                const newForm = {
                                  ...signupForm,
                                  password: text,
                                };
                                setSignupForm(newForm);
                                if (newForm.confirmPassword) {
                                  validatePasswords(
                                    text,
                                    newForm.confirmPassword
                                  );
                                }
                              }}
                              onFocus={() => setFocusedInput("signupPassword")}
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
                            focusedInput === "signupConfirm" &&
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
                                focusedInput === "signupConfirm"
                                  ? theme.accent
                                  : theme.text
                              }
                              style={styles.inputIcon}
                            />
                            <TextInput
                              style={styles.input}
                              placeholder="Confirm password"
                              placeholderTextColor="#999"
                              value={signupForm.confirmPassword}
                              onChangeText={(text) => {
                                const newForm = {
                                  ...signupForm,
                                  confirmPassword: text,
                                };
                                setSignupForm(newForm);
                                validatePasswords(newForm.password, text);
                              }}
                              onFocus={() => setFocusedInput("signupConfirm")}
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
                              !isSignupFormValid() && styles.disabledButton,
                            ]}
                            onPress={handleSignup}
                            disabled={!isSignupFormValid()}
                            activeOpacity={0.8}
                          >
                            <LinearGradient
                              colors={
                                !isSignupFormValid()
                                  ? ["#E0E0E0", "#BDBDBD"]
                                  : [theme.accent, theme.accent + "CC"]
                              }
                              style={styles.buttonGradient}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 0 }}
                            >
                              <Text style={styles.buttonText}>
                                Create Account
                              </Text>
                              <Ionicons
                                name="arrow-forward"
                                size={20}
                                color="white"
                                style={styles.buttonIcon}
                              />
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
    scrollContainer: {
      justifyContent: "center",
      padding: 20,
      minHeight: height,
    },
    scrollContainerWithKeyboard: {
      justifyContent: "flex-start",
      paddingTop: 40,
    },
    logoContainer: {
      alignItems: "center",
      marginBottom: 40,
      paddingTop: 20,
    },
    logoGradient: {
      width: 100,
      height: 100,
      borderRadius: 50,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 20,
      shadowColor: theme.accent,
      shadowOffset: { width: 0, height: 10 },
      shadowOpacity: 0.3,
      shadowRadius: 20,
      elevation: 15,
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
    welcomeSubtitle: {
      fontSize: 16,
      color: theme.text,
      fontWeight: "500",
      textAlign: "center",
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
    tabContainer: {
      flexDirection: "row",
      position: "relative",
      marginBottom: 30,
      backgroundColor: "rgba(0,0,0,0.05)",
      borderRadius: 30,
      padding: 4,
      shadowColor: "rgba(0,0,0,0.1)",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 1,
      shadowRadius: 8,
      elevation: 5,
      borderWidth: 2,
      borderColor: theme.accent,
    },
    tabIndicator: {
      position: "absolute",
      top: 4,
      bottom: 4,
      width: "48%",
      left: 4,
      borderRadius: 25,
      backgroundColor: theme.accent,
      shadowColor: theme.accent,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.4,
      shadowRadius: 12,
      elevation: 10,
    },
    tab: {
      flex: 1,
      paddingVertical: 16,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 20,
      zIndex: 1,
      flexDirection: "row",
    },
    tabIcon: {
      marginRight: 8,
    },
    tabText: {
      fontSize: 16,
      fontWeight: "600",
      color: theme.text,
      opacity: 0.6,
    },
    activeTabText: {
      color: "white",
      fontWeight: "700",
      opacity: 1,
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
      paddingHorizontal: 10,
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
    forgotPassword: {
      alignSelf: "flex-end",
      marginBottom: 25,
      paddingVertical: 8,
      paddingHorizontal: 8,
    },
    forgotPasswordText: {
      color: theme.accent,
      fontSize: 15,
      fontWeight: "600",
      textDecorationLine: "underline",
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

export default AuthScreen;

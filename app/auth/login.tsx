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
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import { useToast } from "@/app/utils/common";
import InputFields, { InputField } from "@/components/Input/Input";
import OTPscreen from "@/components/OTPscreen";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/UserContext";
import { VibrationManager } from "@/utils/Vibrate";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useLocalSearchParams, useRouter } from "expo-router";
import { loginStyles } from "../styles";
import { RootStackParamList } from "../utils/utils";
import { validateField } from "./utils";

import ServiceManager from "@/serviceManager/ServiceManager";

const { width, height } = Dimensions.get("window");
type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

const AuthScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [animatedValue] = useState(new Animated.Value(0));
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const navigation = useNavigation<NavigationProps>();
  const service = ServiceManager.getInstance();
  const { login: authLogin } = useAuth();
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
  const router = useRouter();
  const params = useLocalSearchParams();
  const returnTo = params.returnTo as string;
  const { toastVisible, toastMessage, toastAnim, showToast } = useToast();
  const [isLoginFormValid, setIsLoginFormValid] = useState<boolean>(false);
  const [isSignupFormValid, setIsSignupFormValid] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Form states
  const [loginForm, setLoginForm] = useState({
    loginEmail: "",
    loginPassword: "",
  });

  const [signupForm, setSignupForm] = useState({
    signupName: "",
    signupEmail: "",
    signupPassword: "",
    signupConfirm: "",
  });

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

  const switchTab = (tab: string) => {
    setActiveTab(tab);
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
    if (!isLoginFormValid || isLoading) return;

    setIsLoading(true);
    try {
      const result = await service.login({
        email: loginForm.loginEmail,
        password: loginForm.loginPassword,
      });
      console.log(result.data._id);
      if (result.data._id) {
        VibrationManager.success();
        showToast("Login successful!");

        await authLogin({
          id: result.data.id || result.data._id || loginForm.loginEmail,
          name: result.data.name,
          email: result.data.email,
        });

        if (returnTo) {
          //return
          navigation.navigate("Home");
        } else {
          navigation.navigate("Home");
        }
      } else {
        VibrationManager.error();
        showToast(
          result.message || "Login failed. Please check your credentials."
        );
      }
    } catch (err: any) {
      console.log(err);
      VibrationManager.error();
      let errorMessage = "Login failed. Please check your credentials.";
      if (err?.response?.status === 404) {
        errorMessage = err?.response?.data?.error?.message;
      } else if (err?.response?.status === 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (
        err?.response?.status === 400 &&
        err?.response?.data?.error?.message === "VERIFY_EMAIL"
      ) {
        await service.sendOTP({ email: loginForm.loginEmail });
        setPendingVerification(true);
      } else if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.message?.includes("Network Error")) {
        errorMessage =
          "Network error. Please check your connection and server.";
      } else if (err?.message) {
        errorMessage = err.message;
      }

      showToast(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!isSignupFormValid || isLoading) return;

    setIsLoading(true);
    try {
      const response = await service.signup({
        name: signupForm.signupName,
        password: signupForm.signupPassword,
        email: signupForm.signupEmail,
      });

      if (response?.success) {
        setPendingVerification(true);
        VibrationManager.success();
        showToast("Verification code sent to your email!");
      } else {
        VibrationManager.error();
        showToast("Signup failed. Please try again.");
      }
    } catch (err: any) {
      VibrationManager.error();
      console.log("Signup error:", err);

      let errorMessage = "Signup failed. Please try again.";

      if (err?.response?.status === 404) {
        errorMessage = err?.response?.data?.error?.message;
      } else if (err?.response?.status === 500) {
        errorMessage = "Server error. Please try again later.";
      } else if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.message?.includes("Network Error")) {
        errorMessage =
          "Network error. Please check your connection and server.";
      } else if (err?.message) {
        errorMessage = err.message;
      }

      showToast(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const onVerifyPress = async (otpArr: string[]) => {
    const otp = otpArr?.join("");
    if (isVerifying) return;

    if (!otp?.length) {
      VibrationManager.error();
      showToast(`Please enter a valid verification code`);
      return;
    }
    setIsVerifying(true);
    try {
      const signUpAttempt = await service.verifyOtp({
        otp,
        email: signupForm.signupEmail || loginForm.loginEmail,
      });

      if (signUpAttempt?.success) {
        VibrationManager.success();
        showToast(signUpAttempt.message || "Email verified successfully!");
        navigation.navigate("login");
      } else {
        VibrationManager.error();
        showToast(
          signUpAttempt?.message || "Verification failed. Please try again."
        );
      }
    } catch (err: any) {
      VibrationManager.error();
      let errorMessage = "Something went wrong. Please try again.";

      // if backend sends structured error
      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.message) {
        errorMessage = err.message;
      }

      showToast(errorMessage);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleForgotPassword = () => {
    navigation.navigate("ForgotPassword");
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
      navigation.setOptions({ title: "", headerShown: false });
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

  const handleFieldChange = (fieldId: string, value: string) => {
    let updatedLoginForm = { ...loginForm };
    let updatedSignupForm = { ...signupForm };

    if (fieldId.startsWith("login")) {
      updatedLoginForm = { ...loginForm, [fieldId]: value };
      setLoginForm(updatedLoginForm);

      const isValid = Object.entries(updatedLoginForm).every(([k, v]) => {
        const rules = loginFieldConfig.find(
          (conf) => conf.id === k
        )?.validationRules;
        return validateField(v, rules).isValid;
      });

      setIsLoginFormValid(isValid);
    } else {
      updatedSignupForm = { ...signupForm, [fieldId]: value };
      setSignupForm(updatedSignupForm);

      const isValid = Object.entries(updatedSignupForm).every(([k, v]) => {
        const rules = signupFieldConfig.find(
          (conf) => conf.id === k
        )?.validationRules;
        return validateField(v, rules).isValid;
      });

      setIsSignupFormValid(isValid);
    }
  };

  const onLoginChange = (
    fieldId: string,
    isValid: boolean,
    errorMessage?: string,
    value?: any,
    rules?: any
  ) => {
    // const vv = Object.entries(loginForm)?.every(([k, v], i) => {
    //   const rules = loginFieldConfig.find(
    //     (conf) => conf.id === k
    //   )?.validationRules;
    //   return validateField(v, rules).isValid;
    // });
    // setIsLoginFormValid(vv); // ✅ Remove the negation
  };

  const onSignupChange = (
    fieldId: string,
    isValid: boolean,
    errorMessage?: string,
    value?: any,
    rules?: any
  ) => {};

  const signupFieldConfig: InputField[] = [
    {
      id: "signupName",
      placeholder: "Enter your full name",
      icon: "person-outline",
      validationRules: [
        { type: "required", message: "Full name is required" },
        {
          type: "minLength",
          value: 2,
          message: "Name must be at least 2 characters",
        },
        {
          type: "pattern",
          value: /^[a-zA-Z\s]+$/,
          message: "Name can only contain letters and spaces",
        },
      ],
    },
    {
      id: "signupEmail",
      placeholder: "Enter your email",
      icon: "mail-outline",
      keyboardType: "email-address",
      autoCapitalize: "none",
      validationRules: [
        { type: "required", message: "Email is required" },
        { type: "email", message: "Please enter a valid email address" },
      ],
    },
    {
      id: "signupPassword",
      placeholder: "Create password",
      icon: "lock-closed-outline",
      secureTextEntry: !showPassword,
      trailingIcon: {
        name: showPassword ? "eye-outline" : "eye-off-outline",
        onPress: () => setShowPassword(!showPassword),
      },
      validationRules: [
        { type: "required", message: "Password is required" },
        {
          type: "minLength",
          value: 8,
          message: "Password must be at least 8 characters",
        },
      ],
    },
    {
      id: "signupConfirm",
      placeholder: "Confirm password",
      icon: "checkmark-circle-outline",
      secureTextEntry: !showConfirmPassword,
      trailingIcon: {
        name: showConfirmPassword ? "eye-outline" : "eye-off-outline",
        onPress: () => setShowConfirmPassword(!showConfirmPassword),
      },
      validationRules: [
        { type: "required", message: "Please confirm your password" },
        {
          type: "custom",
          message: "Passwords do not match",
          validator: (value: string) => value === signupForm.signupPassword,
        },
      ],
    },
  ];

  const loginFieldConfig: InputField[] = [
    {
      id: "loginEmail",
      placeholder: "Enter your email",
      icon: "mail-outline",
      keyboardType: "email-address",
      autoCapitalize: "none",
      validationRules: [
        { type: "required", message: "Email is required" },
        { type: "email", message: "Please enter a valid email address" },
      ],
    },
    {
      id: "loginPassword",
      placeholder: "Create password",
      icon: "lock-closed-outline",
      secureTextEntry: !showPassword,
      trailingIcon: {
        name: showPassword ? "eye-outline" : "eye-off-outline",
        onPress: () => setShowPassword(!showPassword),
      },
      validationRules: [
        { type: "required", message: "Password is required" },
        {
          type: "minLength",
          value: 8,
          message: "Password must be at least 8 characters",
        },
        {
          type: "pattern",
          value:
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
          message:
            "Password must contain uppercase, lowercase, number and special character",
        },
      ],
    },
  ];

  // console.log(isLoginFormValid);
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
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
          <TouchableWithoutFeedback
            // onPress={Keyboard.dismiss}
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
                      <InputFields
                        fields={loginFieldConfig}
                        onFieldChange={handleFieldChange} // Make sure this is passed!
                        onValidationChange={onLoginChange}
                        validateOnChange={true}
                        validateOnBlur={false}
                        extraJSX={
                          <TouchableOpacity
                            style={styles.forgotPassword}
                            onPress={handleForgotPassword}
                            activeOpacity={0.7}
                          >
                            <Text style={styles.forgotPasswordText}>
                              Forgot your password?
                            </Text>
                          </TouchableOpacity>
                        }
                        submitButton={
                          <Animated.View
                            style={{ transform: [{ scale: buttonPulse }] }}
                          >
                            <TouchableOpacity
                              style={[
                                styles.primaryButton,
                                !isLoginFormValid && styles.disabledButton,
                              ]}
                              onPress={handleLogin}
                              disabled={!isLoginFormValid}
                              activeOpacity={0.8}
                            >
                              <LinearGradient
                                colors={
                                  !isLoginFormValid
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
                        }
                      />
                    ) : (
                      <InputFields
                        fields={signupFieldConfig}
                        onFieldChange={handleFieldChange} // Make sure this is passed!
                        onValidationChange={onSignupChange}
                        validateOnChange={true}
                        validateOnBlur={false}
                        submitButton={
                          <Animated.View
                            style={{ transform: [{ scale: buttonPulse }] }}
                          >
                            <TouchableOpacity
                              style={[
                                styles.primaryButton,
                                !isSignupFormValid && styles.disabledButton,
                              ]}
                              onPress={handleSignup}
                              disabled={!isSignupFormValid}
                              activeOpacity={0.8}
                            >
                              <LinearGradient
                                colors={
                                  !isSignupFormValid
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
                        }
                      />
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

const createStyles = (theme: any) => loginStyles(theme, height);

export default AuthScreen;

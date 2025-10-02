import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo } from "react";
import {
  Dimensions,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { loginStyles } from "../styles";

const { width, height } = Dimensions.get("window");

const SignupScreen = () => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.form}>
      {/* Name Input */}
      <TouchableOpacity
        style={[
          styles.inputContainer,
          focusedInput === "signupName" && styles.inputFocused,
        ]}
        activeOpacity={1}
        onPress={() => signupNameRef.current?.focus()}
      >
        <LinearGradient
          colors={["rgba(0,0,0,0.02)", "rgba(0,0,0,0.01)"]}
          style={styles.inputGradient}
        >
          <Ionicons
            name="person-outline"
            size={22}
            color={focusedInput === "signupName" ? theme.accent : theme.text}
            style={styles.inputIcon}
            pointerEvents="none"
          />
          <TextInput
            ref={signupNameRef}
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
      </TouchableOpacity>

      {/* Email Input */}
      <TouchableOpacity
        style={[
          styles.inputContainer,
          focusedInput === "signupEmail" && styles.inputFocused,
        ]}
        activeOpacity={1}
        onPress={() => signupEmailRef.current?.focus()}
      >
        <LinearGradient
          colors={["rgba(0,0,0,0.02)", "rgba(0,0,0,0.01)"]}
          style={styles.inputGradient}
        >
          <Ionicons
            name="mail-outline"
            size={22}
            color={focusedInput === "signupEmail" ? theme.accent : theme.text}
            style={styles.inputIcon}
            pointerEvents="none"
          />
          <TextInput
            ref={signupEmailRef}
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
      </TouchableOpacity>

      {/* Password Input */}
      <TouchableOpacity
        style={[
          styles.inputContainer,
          focusedInput === "signupPassword" && styles.inputFocused,
        ]}
        activeOpacity={1}
        onPress={() => signupPasswordRef.current?.focus()}
      >
        <LinearGradient
          colors={["rgba(0,0,0,0.02)", "rgba(0,0,0,0.01)"]}
          style={styles.inputGradient}
        >
          <Ionicons
            name="lock-closed-outline"
            size={22}
            color={
              focusedInput === "signupPassword" ? theme.accent : theme.text
            }
            style={styles.inputIcon}
            pointerEvents="none"
          />
          <TextInput
            ref={signupPasswordRef}
            style={styles.input}
            autoComplete="off"
            passwordRules=""
            textContentType="oneTimeCode"
            autoCorrect={false}
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
                validatePasswords(text, newForm.confirmPassword);
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
            hitSlop={{
              top: 15,
              bottom: 15,
              left: 15,
              right: 15,
            }}
          >
            <Ionicons
              name={showPassword ? "eye-outline" : "eye-off-outline"}
              size={22}
              color={theme.accent}
            />
          </TouchableOpacity>
        </LinearGradient>
      </TouchableOpacity>

      {/* Confirm Password Input */}
      <TouchableOpacity
        style={[
          styles.inputContainer,
          focusedInput === "signupConfirm" && styles.inputFocused,
        ]}
        activeOpacity={1}
        onPress={() => signupConfirmPasswordRef.current?.focus()}
      >
        <LinearGradient
          colors={["rgba(0,0,0,0.02)", "rgba(0,0,0,0.01)"]}
          style={styles.inputGradient}
        >
          <Ionicons
            name="checkmark-circle-outline"
            size={22}
            color={focusedInput === "signupConfirm" ? theme.accent : theme.text}
            style={styles.inputIcon}
            pointerEvents="none"
          />
          <TextInput
            ref={signupConfirmPasswordRef}
            style={styles.input}
            autoComplete="off"
            passwordRules=""
            textContentType="oneTimeCode"
            autoCorrect={false}
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
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            style={styles.eyeIcon}
            activeOpacity={0.7}
            hitSlop={{
              top: 15,
              bottom: 15,
              left: 15,
              right: 15,
            }}
          >
            <Ionicons
              name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
              size={22}
              color={theme.accent}
            />
          </TouchableOpacity>
        </LinearGradient>
      </TouchableOpacity>

      {passwordError ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={16} color="#FF6B6B" />
          <Text style={styles.errorText}>{passwordError}</Text>
        </View>
      ) : null}

      <Animated.View style={{ transform: [{ scale: buttonPulse }] }}>
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
            <Text style={styles.buttonText}>Create Account</Text>
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
  );
};

const createStyles = (theme: any) => loginStyles(theme, height);


export default SignupScreen;

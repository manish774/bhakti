import { validateField } from "@/app/auth/utils";
import { useTheme } from "@/context/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";

// Validation rule types
export interface ValidationRule {
  type: "required" | "email" | "minLength" | "maxLength" | "pattern" | "custom";
  value?: any;
  message: string;
  validator?: (value: string) => boolean;
}

// Enhanced InputField interface
export interface InputField extends Omit<TextInputProps, "onChangeText"> {
  id: string;
  icon?: string; // Made optional for more flexibility
  trailingIcon?: {
    name: string;
    onPress: () => void;
  };
  label?: string;
  validationRules?: ValidationRule[];
  onChangeText?: (text: string) => void;
  showError?: boolean;
  errorMessage?: string;
}

// Component props
interface InputFieldsProps {
  fields: InputField[];
  onFieldChange: (fieldId: string, value: string) => void;
  onValidationChange?: (
    fieldId: string,
    isValid: boolean,
    errorMessage?: string,
    value?: any,
    validationRules?: ValidationRule
  ) => void;
  validateOnChange?: boolean;
  validateOnBlur?: boolean;
  submitButton: React.ReactNode;
  extraJSX?: React.ReactNode;
}

const InputFields: React.FC<InputFieldsProps> = ({
  fields,
  onFieldChange,
  onValidationChange,
  validateOnChange = false,
  validateOnBlur = true,
  submitButton,
  extraJSX,
}) => {
  const { theme } = useTheme();
  const styles = createStyle(theme);
  const [focusedInput, setFocusedInput] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const inputRefs = useRef<Record<string, TextInput | null>>({});
  const errorAnimations = useRef<Record<string, Animated.Value>>({});

  // Initialize error animations
  useEffect(() => {
    fields.forEach((field) => {
      if (!errorAnimations.current[field.id]) {
        errorAnimations.current[field.id] = new Animated.Value(0);
      }
    });
  }, [fields]);

  const handleValidation = useCallback(
    (fieldId: string, value: string) => {
      const field = fields.find((f) => f.id === fieldId);
      if (!field) return;

      const validation = validateField(value, field.validationRules);

      if (!validation.isValid && validation.errorMessage) {
        setFieldErrors((prev) => ({
          ...prev,
          [fieldId]: validation.errorMessage!,
        }));
        // Animate error in
        Animated.spring(errorAnimations.current[fieldId], {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }).start();
      } else {
        // Animate error out
        Animated.spring(errorAnimations.current[fieldId], {
          toValue: 0,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }).start(() => {
          setFieldErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[fieldId];
            return newErrors;
          });
        });
      }

      onValidationChange?.(
        fieldId,
        validation.isValid,
        validation.errorMessage,
        value,
        field?.validationRules
      );
    },
    [fields, onValidationChange]
  );

  const handleTextChange = useCallback(
    (fieldId: string, text: string) => {
      setFieldValues((prev) => ({ ...prev, [fieldId]: text }));
      onFieldChange(fieldId, text);

      const field = fields.find((f) => f.id === fieldId);
      field?.onChangeText?.(text);

      if (validateOnChange) {
        handleValidation(fieldId, text);
      }
    },
    [fields, onFieldChange, validateOnChange, handleValidation]
  );

  const handleFocus = useCallback((fieldId: string) => {
    setFocusedInput(fieldId);
  }, []);

  const handleBlur = useCallback(
    (fieldId: string) => {
      setFocusedInput("");
      if (validateOnBlur) {
        const value = fieldValues[fieldId] || "";
        handleValidation(fieldId, value);
      }
    },
    [fieldValues, validateOnBlur, handleValidation]
  );

  const renderErrorMessage = (fieldId: string) => {
    const errorMessage = fieldErrors[fieldId];
    if (!errorMessage) return null;

    return (
      <Animated.View
        style={[
          styles.errorContainer,
          {
            transform: [
              {
                translateY:
                  errorAnimations.current[fieldId]?.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-20, 0],
                  }) || 0,
              },
            ],
            opacity: errorAnimations.current[fieldId] || 0,
          },
        ]}
      >
        <Ionicons name="alert-circle" size={16} color="#FF6B6B" />
        <Text style={styles.errorText}>{errorMessage}</Text>
      </Animated.View>
    );
  };

  const getInputIcon = (field: InputField) => {
    if (!field.icon) return null;

    return (
      <Ionicons
        name={field.icon as any}
        size={22}
        color={focusedInput === field.id ? theme.accent : theme.text}
        style={styles.inputIcon}
        pointerEvents="none"
      />
    );
  };

  const getTrailingIcon = (field: InputField) => {
    if (!field.trailingIcon) return null;

    return (
      <TouchableOpacity
        style={styles.trailingIconContainer}
        onPress={field.trailingIcon.onPress}
        activeOpacity={0.7}
      >
        <Ionicons
          name={field.trailingIcon.name as any}
          size={20}
          color={theme.text}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.formContainer}>
      {fields?.map((field, index) => {
        const hasError = !!fieldErrors[field.id];
        const isFocused = focusedInput === field.id;

        return (
          <View key={field.id}>
            {field.label && (
              <Text
                style={[
                  styles.labelText,
                  isFocused && styles.labelFocused,
                  hasError && styles.labelError,
                ]}
              >
                {field.label}
              </Text>
            )}

            <TouchableOpacity
              style={[
                styles.inputContainer,
                isFocused && styles.inputFocused,
                hasError && styles.inputError,
              ]}
              activeOpacity={1}
              onPress={() => inputRefs.current[field.id]?.focus()}
            >
              <LinearGradient
                colors={
                  hasError
                    ? ["rgba(255, 107, 107, 0.05)", "rgba(255, 107, 107, 0.02)"]
                    : ["rgba(0,0,0,0.02)", "rgba(0,0,0,0.01)"]
                }
                style={[
                  styles.inputGradient,
                  hasError && styles.inputGradientError,
                ]}
              >
                {getInputIcon(field)}

                <TextInput
                  {...field}
                  ref={(ref) => (inputRefs.current[field.id] = ref)}
                  style={[styles.input, hasError && styles.inputTextError]}
                  value={fieldValues[field.id] || field.value || ""}
                  onFocus={() => handleFocus(field.id)}
                  onBlur={() => handleBlur(field.id)}
                  onChangeText={(text) => {
                    // handleBlur(field.id);
                    handleTextChange(field.id, text);
                  }}
                  placeholderTextColor={theme.text}
                />

                {getTrailingIcon(field)}
              </LinearGradient>
            </TouchableOpacity>

            {renderErrorMessage(field.id)}
          </View>
        );
      })}
      {extraJSX && extraJSX}
      {submitButton && submitButton}
    </View>
  );
};

const createStyle = (theme: any) =>
  StyleSheet.create({
    formContainer: {
      paddingHorizontal: 0,
    },
    labelText: {
      fontSize: 14,
      fontWeight: "600",
      color: theme.textSecondary,
      marginBottom: 8,
      marginLeft: 4,
      transition: "color 0.2s ease",
    },
    labelFocused: {
      color: theme.accent,
    },
    labelError: {
      color: "#FF6B6B",
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
      paddingHorizontal: 15,
      minHeight: 60,
      borderWidth: 2,
      borderColor: "rgba(0,0,0,0.08)",
      borderRadius: 20,
      backgroundColor: "white",
    },
    inputGradientError: {
      borderColor: "rgba(255, 107, 107, 0.3)",
    },
    inputFocused: {
      shadowColor: theme.accent,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.3,
      shadowRadius: 15,
      elevation: 8,
    },
    inputError: {
      shadowColor: "#FF6B6B",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 10,
      elevation: 6,
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
      paddingVertical: 10,
      paddingHorizontal: 0,
      minHeight: 45,
    },
    inputTextError: {
      color: "#FF6B6B",
    },
    trailingIconContainer: {
      padding: 8,
      borderRadius: 15,
      marginLeft: 8,
      minWidth: 36,
      minHeight: 36,
      justifyContent: "center",
      alignItems: "center",
    },
    errorContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 20,
      marginTop: -16,
      paddingHorizontal: 16,
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
  });

export default InputFields;

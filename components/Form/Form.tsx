import { useTheme } from "@/context/ThemeContext";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface IFormProps {
  isFormValid: boolean;
  updateValues: (
    name: string,
    value: string,
    mandatory: boolean,
    minLength?: number,
    maxLength?: number
  ) => void;
  inputValues: Record<string, string>;
}

const FormContext = createContext<IFormProps | undefined>(undefined);

type FormType = React.FC<{ children: ReactNode }> & {
  Input: React.FC<{
    name: string;
    placeholder?: string;
    style?: any;
    mandatory?: boolean;
    type?:
      | "text"
      | "password"
      | "email"
      | "number"
      | "phone"
      | "url"
      | "numeric";
    minLength?: number;
    maxLength?: number;
  }>;
  Submit: React.FC<{
    children: ReactNode;
    onPress?: (e: any) => void;
    style?: any;
  }>;
};

const Form: FormType = ({ children }) => {
  const { theme } = useTheme();
  const [formState, setFormState] = useState<{
    values: Record<string, string>;
    mandatoryFields: string[];
    constraints: Record<string, { min?: number; max?: number }>;
  }>({
    values: {},
    mandatoryFields: [],
    constraints: {},
  });

  const updateValues = useCallback(
    (
      name: string,
      value: string,
      mandatory: boolean,
      minLength?: number,
      maxLength?: number
    ) => {
      setFormState((prev) => {
        const prevValue = prev.values[name] ?? "";
        const prevConstraint = prev.constraints[name] || {};
        const prevMandatoryIncluded = prev.mandatoryFields.includes(name);

        const shouldUpdateValue = prevValue !== value;
        const shouldUpdateMandatory = mandatory && !prevMandatoryIncluded;
        const shouldUpdateMin =
          typeof minLength === "number" && prevConstraint.min !== minLength;
        const shouldUpdateMax =
          typeof maxLength === "number" && prevConstraint.max !== maxLength;

        // If nothing would change, bail out to avoid unnecessary state updates
        if (
          !shouldUpdateValue &&
          !shouldUpdateMandatory &&
          !shouldUpdateMin &&
          !shouldUpdateMax
        ) {
          return prev;
        }

        const newValues = { ...prev.values, [name]: value };
        let newMandatoryFields = [...prev.mandatoryFields];
        const newConstraints = { ...prev.constraints };

        if (mandatory && !newMandatoryFields.includes(name)) {
          newMandatoryFields.push(name);
        }

        if (typeof minLength === "number" || typeof maxLength === "number") {
          newConstraints[name] = {
            ...(newConstraints[name] || {}),
            min:
              typeof minLength === "number"
                ? minLength
                : newConstraints[name]?.min,
            max:
              typeof maxLength === "number"
                ? maxLength
                : newConstraints[name]?.max,
          };
        }

        return {
          values: newValues,
          mandatoryFields: newMandatoryFields,
          constraints: newConstraints,
        };
      });
    },
    [setFormState]
  );

  // Calculate form validity
  const isFormValid =
    formState.mandatoryFields.length > 0 &&
    formState.mandatoryFields.every((fieldName) => {
      const value = formState.values[fieldName];
      const min = formState.constraints[fieldName]?.min ?? 1;
      return value.trim().length >= min;
    });

  const contextValue = useMemo(
    () => ({ updateValues, isFormValid, inputValues: formState.values }),
    [updateValues, isFormValid, formState.values]
  );

  return (
    <FormContext.Provider value={contextValue}>
      <View style={{ backgroundColor: theme.background }}>{children}</View>
    </FormContext.Provider>
  );
};

const Input: React.FC<{
  name: string;
  placeholder?: string;
  style?: any;
  mandatory?: boolean;
  type?: "text" | "password" | "email" | "number" | "phone" | "url" | "numeric";
  minLength?: number;
  maxLength?: number;
}> = ({
  name,
  placeholder,
  style,
  mandatory = false,
  type = "text",
  minLength,
  maxLength,
}) => {
  const formUseContext = useContext(FormContext);
  const { theme } = useTheme();
  const inputRef = useRef<TextInput>(null);
  const value = formUseContext?.inputValues?.[name] ?? "";
  const inputType = type;

  useEffect(() => {
    if (
      formUseContext &&
      formUseContext.inputValues &&
      !(name in formUseContext.inputValues)
    ) {
      formUseContext.updateValues(name, "", mandatory, minLength, maxLength);
    }
  }, [formUseContext, name, mandatory, minLength, maxLength]);

  // If min/max constraints are provided, register them once
  useEffect(() => {
    if (!formUseContext) return;
    if (typeof minLength === "number" || typeof maxLength === "number") {
      // register constraints without changing value
      formUseContext.updateValues(
        name,
        formUseContext.inputValues[name] ?? "",
        mandatory,
        minLength,
        maxLength
      );
    }
  }, [formUseContext, name, mandatory, minLength, maxLength]);

  // Map our `type` to RN TextInput props
  const textInputProps: any = {};
  const isNumericType = inputType === "number" || inputType === "numeric";

  switch (inputType) {
    case "password":
      textInputProps.secureTextEntry = true;
      textInputProps.autoCapitalize = "none";
      textInputProps.textContentType = "password" as any;
      textInputProps.returnKeyType = "done";
      textInputProps.onSubmitEditing = () => inputRef.current?.blur();
      break;
    case "email":
      textInputProps.keyboardType = "email-address";
      textInputProps.autoCapitalize = "none";
      textInputProps.textContentType = "emailAddress" as any;
      textInputProps.returnKeyType = "done";
      textInputProps.onSubmitEditing = () => inputRef.current?.blur();
      break;
    case "number":
    case "numeric":
      // For numeric inputs, we'll use default keyboard but with numeric input mode
      // This gives us both numbers and a done/return button
      textInputProps.keyboardType = "numeric"; // Changed from "number-pad"
      textInputProps.autoCorrect = false;
      textInputProps.textContentType = "none" as any;
      textInputProps.returnKeyType = "done";
      textInputProps.onSubmitEditing = () => inputRef.current?.blur();
      // Provide web-friendly hint when using react-native-web
      (textInputProps as any).inputMode = "numeric";
      if (typeof maxLength === "number") {
        textInputProps.maxLength = maxLength;
      }
      break;
    case "phone":
      textInputProps.keyboardType = "phone-pad";
      // Note: phone-pad doesn't support returnKeyType, but we can add a blur timeout
      break;
    case "url":
      textInputProps.keyboardType = "url" as any;
      textInputProps.autoCapitalize = "none";
      textInputProps.textContentType = "URL" as any;
      textInputProps.returnKeyType = "done";
      textInputProps.onSubmitEditing = () => inputRef.current?.blur();
      break;
    case "text":
    default:
      textInputProps.returnKeyType = "done";
      textInputProps.onSubmitEditing = () => inputRef.current?.blur();
      break;
  }

  const handleTextChange = (text: string) => {
    // For numeric types, filter out non-numeric characters
    if (isNumericType) {
      text = text.replace(/[^0-9]/g, "");
    }

    // Apply maxLength validation - don't allow input beyond maxLength
    if (typeof maxLength === "number" && text.length > maxLength) {
      return; // Don't update if text exceeds maxLength
    }

    formUseContext?.updateValues(name, text, mandatory, minLength, maxLength);
  };

  // For phone-pad (which doesn't support returnKeyType), we can add a "Done" button overlay
  const showDoneButton = inputType === "phone";

  return (
    <View style={styles.inputContainer}>
      <TextInput
        ref={inputRef}
        value={value}
        placeholder={placeholder}
        placeholderTextColor={theme?.text}
        onChangeText={handleTextChange}
        {...textInputProps}
        style={[
          styles.input,
          {
            borderColor: theme?.cardBorder,
            backgroundColor: theme?.card,
            color: theme?.text,
          },
          style,
        ]}
      />
      {showDoneButton && value.length > 0 && (
        <TouchableOpacity
          style={[styles.doneButton, { backgroundColor: theme?.accent }]}
          onPress={() => inputRef.current?.blur()}
        >
          <Text style={[styles.doneButtonText, { color: theme?.buttonText }]}>
            Done
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

type SubmitProps = {
  children: ReactNode;
  onPress?: (e?: Record<string, string>) => void;
  style?: any;
};
const Submit: React.FC<SubmitProps> = ({ children, onPress, style }) => {
  const formUseContext = useContext(FormContext);
  const { theme } = useTheme();

  const handlePress = (e?: any) => {
    if (!formUseContext?.isFormValid) return;
    onPress?.(formUseContext.inputValues);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.8}
      disabled={!formUseContext?.isFormValid}
      style={[
        styles.button,
        {
          backgroundColor: formUseContext?.isFormValid
            ? theme?.accent
            : theme?.accent,
          borderColor: theme?.cardBorder,
        },
        !formUseContext?.isFormValid && styles.buttonDisabled,
        style,
      ]}
    >
      {typeof children === "string" ? (
        <Text style={[styles.buttonText, { color: theme?.buttonText }]}>
          {children}
        </Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
};

Form.Input = Input;
Form.Submit = Submit;

const styles = StyleSheet.create({
  inputContainer: {
    position: "relative",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 6,
    marginVertical: 6,
    height: 50,
  },
  doneButton: {
    position: "absolute",
    right: 8,
    top: 14,
    backgroundColor: "#0066CC",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  },
  doneButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  button: {
    backgroundColor: "#0066CC",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});

export default Form;

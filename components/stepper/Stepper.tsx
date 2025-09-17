import { VibrationManager } from "@/utils/Vibrate";
import React, { useMemo, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { FAB, Text } from "react-native-paper";
import { useTheme } from "../../context/ThemeContext";

type FormProps = {
  name: string;
  type: string;
  placeholder?: string;
  mandatory?: boolean;
  minLength?: number;
  maxLength?: number;
  value: string | number | undefined;
  id: number;
};

type IStepper = {
  name: string;
  content: React.ReactNode;
  visible: boolean;
  isValid: (props: any) => boolean;
  formProps?: FormProps[];
  descriptionForm?: string | null;
};

const Stepper = () => {
  const [steps, setSteps] = useState<IStepper[]>([
    {
      name: "step1",
      content: <Text>Heheh</Text>,
      visible: true,
      isValid: (props: FormProps[]): boolean => {
        return !props.every((x) => x.value !== "");
      },
      formProps: [
        {
          id: 1,
          name: "name",
          type: "text",
          placeholder: "Enter your name",
          mandatory: true,
          minLength: 2,
          value: "",
        },
        {
          id: 2,
          name: "password",
          type: "password",
          placeholder: "Enter password.",
          mandatory: true,
          minLength: 6,
          value: "",
        },
      ],
      descriptionForm: null,
    },
    {
      name: "step2",
      content: <Text>most</Text>,
      visible: false,
      isValid: (props: FormProps[]): boolean => {
        return !props.every((x) => x.value !== "");
      },
      formProps: [
        {
          id: 3,
          name: "email",
          type: "email",
          placeholder: "Enter your email",
          mandatory: true,
          value: "",
        },
        {
          id: 4,
          name: "phone",
          type: "phone",
          placeholder: "Enter phone number",
          mandatory: false,
          maxLength: 10,
          value: "",
        },
      ],
      descriptionForm: null,
    },
    {
      name: "step3",
      content: <Text>Hello</Text>,
      visible: false,
      isValid: (props: any): boolean => {
        return true;
      },
      descriptionForm: "Final step description",
    },
  ]);

  const [currentStep, setCurrentStep] = useState(steps[0]);

  const theme = useTheme();
  const shouldAllVisible = false;

  const stepLength = useMemo(
    () => steps.filter((x) => x.visible).length - 1,
    [steps]
  );

  const isAllStepsRendered = steps?.length === stepLength + 1;

  const onAdd = () => {
    const lastRenderedStep = steps.filter((step) => step.visible).length - 1;
    const nextRenderIndex = lastRenderedStep + 1;
    const updateSteps = steps.map((step, index) => ({
      ...step,
      visible: nextRenderIndex === index ? true : step.visible,
    }));
    setSteps(updateSteps);
    setCurrentStep(steps[nextRenderIndex]);
  };

  const onRemove = () => {
    const lastRenderedStep = steps.filter((step) => step.visible).length - 1;

    const updateSteps = steps.map((x, i) => ({
      ...x,
      visible: i === lastRenderedStep ? false : x.visible,
    }));
    setSteps(updateSteps);
  };

  const styles = createStyles(theme);

  const validateStep = (value: string, name: string) => {
    const updatedSteps = steps.map((step) => {
      if (step.name === currentStep.name && step.formProps) {
        return {
          ...step,
          formProps: step.formProps.map((x) =>
            x.name === name ? { ...x, value } : x
          ),
        };
      }
      return step;
    });

    setSteps(updatedSteps);

    // also update currentStep reference
    const updatedCurrentStep = updatedSteps.find(
      (step) => step.name === currentStep.name
    );
    if (updatedCurrentStep) {
      setCurrentStep(updatedCurrentStep);
    }
  };

  const getForms = (formProps: FormProps[]) => {
    return formProps.map((x) => {
      return (
        <TextInput
          key={x.name}
          placeholder={x.placeholder || x.name}
          placeholderTextColor={theme?.text}
          style={[
            styles.formInput,
            {
              borderColor: theme?.cardBorder || "#ccc",
              backgroundColor: theme?.card || "#fff",
              color: theme?.text || "#333",
            },
          ]}
          onChangeText={(e) => validateStep(e, x.name)}
        />
      );
    });
  };

  const getDescriptions = (description: string) => {
    return (
      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionText}>{description}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {steps?.map(
        (step, index) =>
          step.visible && (
            <View style={styles.stepContainer} key={step.name}>
              <View style={styles.stepContent}>
                <View style={styles.indicatorWrapper}>
                  <View style={styles.stepIndicator} />
                  {index < stepLength && <View style={styles.connectingLine} />}
                </View>
                {step?.formProps || step.descriptionForm ? (
                  <View style={styles.contentWrapper}>
                    <View style={styles.stepText}>
                      {step?.formProps
                        ? getForms(step?.formProps)
                        : step?.descriptionForm &&
                          getDescriptions(step?.descriptionForm)}
                    </View>
                  </View>
                ) : (
                  <View style={styles.placeholderContainer}>
                    <Text style={styles.placeholderText}>
                      Form dalo ya description
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )
      )}

      {/* FAB moved outside the map and below all steps */}
      {!isAllStepsRendered && (
        <View style={styles.fabContainer}>
          <FAB
            icon="plus"
            style={styles.addMore}
            onPress={() => {
              VibrationManager.stop();
              onAdd();
            }}
            color="#ffffff"
            size="small"
            disabled={currentStep?.isValid(currentStep.formProps)}
          />
        </View>
      )}
      {/* <Button onPress={onRemove}>Remove Step</Button> */}
    </View>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 16,
      paddingVertical: 8,
    },
    stepContainer: {
      marginBottom: 0,
    },
    stepContent: {
      flexDirection: "row",
      alignItems: "flex-start",
    },
    indicatorWrapper: {
      alignItems: "center",
      position: "relative",
    },
    stepIndicator: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: theme.primary || "#007AFF",
      marginRight: 16,
      zIndex: 1,
    },
    connectingLine: {
      position: "absolute",
      top: 24,
      width: 2,
      height: "100%",
      backgroundColor: theme.primary || "#007AFF",
      left: 11,
    },
    contentWrapper: {
      flex: 1,
      minHeight: 60,
      paddingVertical: 12,
      paddingHorizontal: 12,
      backgroundColor: theme.surface || "#f8f9fa",
      borderRadius: 8,
      borderLeftWidth: 3,
      borderLeftColor: theme.primary || "#ff7b00ff",
      marginBottom: 16,
    },
    formInput: {
      borderWidth: 1,
      borderColor: "#ccc",
      padding: 10,
      borderRadius: 6,
      marginVertical: 6,
      height: 50,
    },
    descriptionContainer: {
      padding: 8,
    },
    descriptionText: {
      fontSize: 16,
      color: theme.text || "#333333",
      lineHeight: 24,
    },
    placeholderContainer: {
      flex: 1,
      padding: 16,
      alignItems: "center",
      justifyContent: "center",
    },
    placeholderText: {
      fontSize: 14,
      color: theme.textSecondary || "#666666",
      fontStyle: "italic",
    },
    stepText: {
      fontSize: 16,
      color: theme.text || "#333333",
      lineHeight: 24,
    },
    fabContainer: {
      alignItems: "baseline",
      marginTop: 8,
      paddingTop: 8,
    },
    addMore: {
      backgroundColor: theme.button || "#007AFF",
      borderRadius: 28,
      elevation: 6,
      shadowColor: theme.text || "#000000",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.25,
      shadowRadius: 6,
      width: 56,
      height: 56,
      alignItems: "center",
      justifyContent: "center",
    },
  });

export default Stepper;

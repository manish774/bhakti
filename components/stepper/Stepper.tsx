import { FormProps, IStepper } from "@/app/Description/types";
import { VibrationManager } from "@/utils/Vibrate";
import React, { useMemo, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import { FAB, Text } from "react-native-paper";
import { useTheme } from "../../context/ThemeContext";

const Stepper = ({
  steps: newSteps,
  headerContent,
  bottomContent,
  onSubmit,
}: {
  steps: IStepper[];
  headerContent?: React.ReactNode;
  bottomContent?: React.ReactNode;
  onSubmit?: (data: any) => any;
}) => {
  const [steps, setSteps] = useState(newSteps);
  const [currentStep, setCurrentStep] = useState(newSteps[0]);
  const { theme } = useTheme();
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

  const validateStep = (value: string, name: string, mStep: IStepper) => {
    const updatedSteps = steps.map((step) => {
      if (step.name === mStep.name && step.formProps) {
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
      (step) => step.name === mStep.name
    );
    if (updatedCurrentStep) {
      setCurrentStep(updatedCurrentStep);
    }
  };

  const getForms = (formProps: FormProps[], step: IStepper) => {
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
          onChangeText={(e) => validateStep(e, x.name, step)}
        />
      );
    });
  };

  const getDescriptions = (description: string | React.ReactNode) => {
    if (typeof description === "string") {
      return <Text>{description}</Text>;
    }
    return description;
  };

  const isAllFormsValid = () => {
    return steps.some((x) => x.isValid(x.formProps));
  };

  return (
    <View style={styles.container}>
      {headerContent}
      {steps?.map(
        (step, index) =>
          step.visible && (
            <View style={styles.stepContainer} key={step.name}>
              <View style={styles.stepContent}>
                <View style={styles.indicatorWrapper}>
                  <View style={styles.stepIndicator} />
                  {index <= stepLength && (
                    <View style={styles.connectingLine} />
                  )}
                </View>
                {step?.formProps || step.descriptionForm ? (
                  <View style={styles.contentWrapper}>
                    <View style={styles.stepText}>
                      {step?.formProps
                        ? getForms(step?.formProps, step)
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
      {!isAllStepsRendered ? (
        <View style={styles.fabContainer}>
          <FAB
            icon="plus"
            style={styles.addMore}
            onPress={() => {
              VibrationManager.stop();
              onAdd();
            }}
            color={theme.buttonText || "#ffffff"}
            size="small"
            disabled={currentStep?.isValid(currentStep.formProps)}
          />
        </View>
      ) : (
        <View style={[styles.fabContainer, styles.submitFab]}>
          <FAB
            icon="check"
            style={styles.addMore}
            color={theme.buttonText || "#ffffff"}
            size="small"
            disabled={isAllFormsValid()}
            onPress={() => {
              onSubmit(
                steps.map((x) => {
                  return x?.formProps || [];
                })
              );
            }}
          />
          <Text style={styles.submitText}>Click To Complete</Text>
        </View>
      )}
      {/* <Button onPress={onRemove}>Remove Step</Button> */}
      {bottomContent}
    </View>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      // backgroundColor: theme.background,
      paddingHorizontal: 0,
      paddingVertical: 0,
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
      backgroundColor: theme.button || "#007AFF",
      marginRight: 16,
      zIndex: 1,
      elevation: 4,
      shadowColor: theme.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
    },
    connectingLine: {
      position: "absolute",
      top: 24,
      width: 2,
      minHeight: 125,
      height: "100%",
      backgroundColor: theme.button,
      left: 11,
      opacity: 0.6,
    },
    contentWrapper: {
      flex: 1,
      minHeight: 60,
      paddingVertical: 8,
      paddingHorizontal: 10,
      backgroundColor: theme.card || "#f8f9fa",
      borderRadius: 16,
      borderColor: theme.cardBorder,
      marginBottom: 8,
      elevation: 6,
      shadowColor: theme.text,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
    },
    formInput: {
      borderWidth: 1,
      borderColor: theme.cardBorder || "#ccc",
      backgroundColor: theme.background,
      color: theme.text,
      padding: 12,
      borderRadius: 12,
      marginVertical: 6,
      height: 50,
      fontSize: 16,
      elevation: 2,
      shadowColor: theme.text,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
    },
    descriptionContainer: {
      padding: 8,
    },
    descriptionText: {
      fontSize: 16,
      color: theme.text || "#333333",
      lineHeight: 24,
      fontWeight: "500",
    },
    placeholderContainer: {
      flex: 1,
      padding: 16,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.card,
      borderRadius: 12,
    },
    placeholderText: {
      fontSize: 14,
      color: theme.text || "#666666",
      fontStyle: "italic",
      opacity: 0.6,
    },
    stepText: {
      fontSize: 16,
      color: theme.text || "#333333",
      lineHeight: 24,
    },
    fabContainer: {
      alignItems: "baseline",
      marginTop: 16,
      paddingTop: 8,
      marginLeft: -8,
    },
    addMore: {
      backgroundColor: theme.button || "#007AFF",
      borderRadius: 28,
      elevation: 8,
      shadowColor: theme.text || "#000000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      width: 40,
      height: 40,
      alignItems: "center",
      justifyContent: "center",
    },
    submitFab: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
    },
    submitText: {
      fontSize: 16,
      color: theme.text || "#333",
      fontWeight: "500",
    },
  });

export default Stepper;

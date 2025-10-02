import { FormProps, IStepper } from "@/app/Description/types";
import { VibrationManager } from "@/utils/Vibrate";
import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo, useState } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { FAB } from "react-native-paper";
import { useTheme } from "../../context/ThemeContext";

const { height, width } = Dimensions.get("window");

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
  const [isSuccess, setIsSuccess] = useState(false);
  const [flowerAnims, setFlowerAnims] = useState<Animated.Value[]>([]);

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
    const updatedCurrentStep = updatedSteps.find(
      (step) => step.name === mStep.name
    );
    if (updatedCurrentStep) setCurrentStep(updatedCurrentStep);
  };

  const getForms = (formProps: FormProps[], step: IStepper) => {
    return formProps.map((x) => (
      <TextInput
        key={x.name}
        placeholder={x.placeholder || x.name}
        placeholderTextColor={theme?.text + "80"}
        style={[
          styles.formInput,
          {
            borderColor: theme?.cardBorder || "#ddd",
            backgroundColor: theme?.card || "#fff",
            color: theme?.text || "#333",
          },
        ]}
        onChangeText={(e) => validateStep(e, x.name, step)}
      />
    ));
  };

  const getDescriptions = (description: string | React.ReactNode) => {
    if (typeof description === "string") {
      return <Text style={styles.descriptionText}>{description}</Text>;
    }
    return description;
  };

  const isAllFormsValid = () => steps.some((x) => x.isValid(x.formProps));

  // Flower animation trigger
  const startFlowerAnimation = () => {
    const newAnims = Array.from({ length: 10 }, () => new Animated.Value(0));
    setFlowerAnims(newAnims);

    newAnims.forEach((anim, i) => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 4000,
        delay: i * 200,
        useNativeDriver: true,
      }).start();
    });
  };

  const handleSubmit = () => {
    setIsSuccess(true);
    startFlowerAnimation();
    onSubmit?.(
      steps.map((x) => {
        return x?.formProps || [];
      })
    );
  };

  if (isSuccess) {
    return (
      <LinearGradient
        colors={["#4CAF50", "#2E7D32"]}
        style={styles.successContainer}
      >
        <View style={styles.successCard}>
          <Text style={styles.checkIcon}>✔️</Text>
          <Text style={styles.successText}>Booking Successful!</Text>
          <Text style={styles.successSubText}>
            Your puja has been booked successfully. 🙏
          </Text>
        </View>

        {flowerAnims.map((anim, i) => {
          const translateY = anim.interpolate({
            inputRange: [0, 1],
            outputRange: [-50, height + 50],
          });
          const translateX = Math.random() * width;
          const rotate = anim.interpolate({
            inputRange: [0, 1],
            outputRange: ["0deg", `${Math.random() * 360}deg`],
          });

          return (
            <Animated.Text
              key={i}
              style={[
                styles.flower,
                { transform: [{ translateY }, { translateX }, { rotate }] },
              ]}
            >
              🌸
            </Animated.Text>
          );
        })}
      </LinearGradient>
    );
  }

  return (
    <View style={styles.container}>
      {headerContent}

      {steps?.map(
        (step, index) =>
          step.visible && (
            <View style={styles.stepContainer} key={step.name}>
              <View style={styles.stepContent}>
                {/* Step Indicator */}
                <View style={styles.indicatorWrapper}>
                  <LinearGradient
                    colors={
                      index === stepLength
                        ? [theme.button, theme.accent || "#FF9800"]
                        : ["#d3d3d3", "#b0b0b0"]
                    }
                    style={styles.stepIndicator}
                  >
                    <Text style={styles.stepNumber}>{index + 1}</Text>
                  </LinearGradient>
                  {<View style={styles.connectingLine} />}
                </View>

                {/* Step Content */}
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

      {/* Floating Action Buttons */}
      {!isAllStepsRendered ? (
        <View style={styles.fabContainer}>
          <FAB
            icon="arrow-right"
            style={styles.addMore}
            onPress={() => {
              VibrationManager.stop();
              onAdd();
            }}
            color={theme.buttonText || "#fff"}
            size="medium"
            disabled={currentStep?.isValid(currentStep.formProps)}
          />
        </View>
      ) : (
        <View style={[styles.fabContainer, styles.submitFab]}>
          <FAB
            icon="check"
            style={styles.addMore}
            color={theme.buttonText || "#fff"}
            size="medium"
            disabled={isAllFormsValid()}
            onPress={handleSubmit}
          />
          <Text style={styles.submitText}>Complete Booking</Text>
        </View>
      )}

      {bottomContent}
    </View>
  );
};

const createStyles = (theme: any) =>
  StyleSheet.create({
    container: {
      paddingVertical: 8,
    },
    stepContainer: {
      marginBottom: 12,
    },
    stepContent: {
      flexDirection: "row",
      alignItems: "flex-start",
    },
    indicatorWrapper: {
      alignItems: "center",
      marginRight: 16,
      position: "relative",
    },
    stepIndicator: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: "center",
      justifyContent: "center",
      elevation: 5,
    },
    stepNumber: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: 16,
    },
    connectingLine: {
      position: "absolute",
      top: 36,
      width: 2,
      height: "100%",
      backgroundColor: theme.button,
      opacity: 0.4,
    },
    contentWrapper: {
      flex: 1,
      minHeight: 70,
      padding: 14,
      backgroundColor: theme.card,
      borderRadius: 16,
      elevation: 3,
    },
    formInput: {
      borderWidth: 1,
      padding: 14,
      borderRadius: 12,
      marginVertical: 8,
      height: 50,
      fontSize: 15,
    },
    descriptionText: {
      fontSize: 16,
      color: theme.text,
      lineHeight: 22,
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
      color: theme.text,
      opacity: 0.6,
      fontStyle: "italic",
    },
    fabContainer: {
      alignItems: "flex-end",
      marginTop: 20,
      left: -10,
    },
    addMore: {
      backgroundColor: theme.button,
      borderRadius: 30,
      width: 56,
      height: 56,
      justifyContent: "center",
      alignItems: "center",
      elevation: 8,
    },
    submitFab: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    submitText: {
      fontSize: 16,
      color: theme.text,
      fontWeight: "600",
    },
    successContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    successCard: {
      width: width * 0.8,
      backgroundColor: "#fff",
      borderRadius: 20,
      padding: 30,
      alignItems: "center",
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 6,
    },
    checkIcon: {
      fontSize: 60,
      marginBottom: 20,
      color: "#4CAF50",
    },
    successText: {
      fontSize: 26,
      fontWeight: "700",
      color: "#2E7D32",
      marginBottom: 10,
      textAlign: "center",
    },
    successSubText: {
      fontSize: 16,
      color: "#555",
      textAlign: "center",
      lineHeight: 22,
      marginBottom: 10,
    },
    flower: {
      position: "absolute",
      fontSize: 28,
    },
  });

export default Stepper;

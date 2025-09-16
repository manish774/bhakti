import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const VerticalStepper = () => {
  const [activeStep, setActiveStep] = useState(0);
  const steps = [
    "Step 1: Personal Info",
    "Step 2: Delivery Address",
    "Step 3: Payment",
  ];

  const handleNext = () => {
    setActiveStep((prevActiveStep) =>
      Math.min(prevActiveStep + 1, steps.length - 1)
    );
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => Math.max(prevActiveStep - 1, 0));
  };

  return (
    <View style={styles.container}>
      {steps.map((label, index) => (
        <View key={index} style={styles.stepContainer}>
          <View
            style={[
              styles.stepIndicator,
              index === activeStep && styles.activeStepIndicator,
            ]}
          >
            <Text style={styles.stepNumber}>{index + 1}</Text>
          </View>
          <Text
            style={[
              styles.stepLabel,
              index === activeStep && styles.activeStepLabel,
            ]}
          >
            {label}
          </Text>
          {index < steps.length - 1 && <View style={styles.connectorLine} />}
        </View>
      ))}

      <View style={styles.contentContainer}>
        {/* Render content specific to the active step */}
        <Text>Content for {steps[activeStep]}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={handleBack}
            disabled={activeStep === 0}
            style={styles.button}
          >
            <Text>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleNext}
            disabled={activeStep === steps.length - 1}
            style={styles.button}
          >
            <Text>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    flexDirection: "row", // For vertical layout, steps arranged in a column, content next to it
  },
  stepContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  stepIndicator: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  activeStepIndicator: {
    backgroundColor: "blue",
  },
  stepNumber: {
    color: "white",
    fontWeight: "bold",
  },
  stepLabel: {
    marginTop: 5,
    fontSize: 14,
    color: "#333",
  },
  activeStepLabel: {
    fontWeight: "bold",
    color: "blue",
  },
  connectorLine: {
    width: 2,
    height: 30, // Adjust height as needed
    backgroundColor: "#ccc",
    marginVertical: 5,
  },
  contentContainer: {
    flex: 1,
    marginLeft: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    padding: 10,
    backgroundColor: "#eee",
    borderRadius: 5,
  },
});

export default VerticalStepper;

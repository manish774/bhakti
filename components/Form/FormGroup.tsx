import React from "react";
import { View } from "react-native";
import { Button } from "react-native-paper";
type stepsProps = {
  id: string;
  isValid: boolean;
  content: React.ReactNode;
};
// type FormGroup = {
//   steps:
// };

const FormGroup = ({ steps }) => {
  return (
    <View>
      <Button>Submit</Button>
    </View>
  );
};

export default FormGroup;

import React from "react";
import { View } from "react-native";
import { Button } from "react-native-paper";
type FormGroup = {
  children: React.ReactNode;
};
const FormGroup = ({ children }: FormGroup) => {
  return (
    <View>
      {children}
      <Button>Submit</Button>
    </View>
  );
};

export default FormGroup;

import { Linking } from "react-native";
import { FormProps, IStepper } from "./types";

export const openWhatsApp = ({ message }: { message: string }) => {
  const phoneNumber = "919031440979"; // India country code + your number
  const packageType = "";

  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `whatsapp://send?phone=${phoneNumber}&text=${encodedMessage}`;
  const webWhatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

  // Try to open WhatsApp app first, fallback to web version
  Linking.canOpenURL(whatsappUrl)
    .then((supported) => {
      if (supported) {
        return Linking.openURL(whatsappUrl);
      } else {
        return Linking.openURL(webWhatsappUrl);
      }
    })
    .catch((err) => {
      console.error("An error occurred", err);
      // Fallback to web version
      Linking.openURL(webWhatsappUrl);
    });
};

export const createSteps = (props: IStepper) => {
  return {
    name: props.name,
    visible: props.visible,
    isValid: (props: FormProps[]): boolean => {
      return !props.every((x) => x.value !== "");
    },
    formProps: [] as FormProps[],
    descriptionForm: null,
  };
};

export const createPackageSteps = (noOfUsers: number) => {
  const steps = Array.from({ length: noOfUsers }, (_, index) => ({
    name: `pkg_${index}`,
    visible: index === 0,
    isValid: (props: FormProps[]): boolean => {
      return !props.every((x) => x.value !== "");
    },
    formProps: [
      {
        id: 1,
        name: "name",
        type: "text",
        placeholder: `Name of devotee ${index + 1}`,
        mandatory: true,
        minLength: 2,
        value: "",
      },
      {
        id: 2,
        name: "gotra",
        type: "text",
        placeholder: `Enter Gotra for devotee ${index + 1}`,
        mandatory: true,
        minLength: 2,
        value: "",
      },
    ],
    descriptionForm: null,
  }));
  // if (packageDetails) {
  //   steps.push({
  //     name: "Detail",
  //     visible: false,
  //     isValid: (props: FormProps[]): boolean => true,
  //     formProps: null,
  //     descriptionForm: packageDetails,
  //   });
  // }

  return steps;
};

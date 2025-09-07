import { Core } from "@/serviceManager/ServiceManager";
import { VibrationManager } from "@/utils/Vibrate";
import { Linking } from "react-native";

export const openWhatsApp = ({
  name,
  userPhone,
  selectedDevoteeType,
  item,
}: {
  name: string;
  userPhone: number | string;
  selectedDevoteeType: string | undefined;
  item: any;
}) => {
  const phoneNumber = "919031440979"; // India country code + your number
  const packageType = "";
  if (!selectedDevoteeType) {
    VibrationManager.error();
  }

  const message = `Hi ${name}, you have selected package for ${packageType} for ${
    item?.[Core.Name]
  } temple puja. ${userPhone}`;
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

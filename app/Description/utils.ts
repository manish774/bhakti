import { Linking } from "react-native";

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

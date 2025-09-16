import { prasadamOnlyFormProps } from "./types";

export type PrasadamProps<T> = {
  [K in keyof typeof prasadamOnlyFormProps as `${(typeof prasadamOnlyFormProps)[K]}`]: T;
};

export const prasadamTemplate = (props: PrasadamProps<string>) => {
  // Use all props explicitly for a clear, friendly message
  const {
    userName,
    templetName,
    pujaName,
    amount,
    lastDate,
    address,

    phone,
    postalCode,
  } = props;

  let message = `🙏 *Hello ${userName.toUpperCase()},*\n\n`;
  message += `Welcome to *${templetName.toUpperCase()}*.\n\n`;
  message += `Now you can easily book your Puja online and receive Prasad delivered to your home.\n\n`;
  message += `✨ *PUJA DETAILS:*\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  message += `🔹 *Puja:* ${pujaName.toUpperCase()}\n\n`;
  message += `🔹 *Date & Time:* ${lastDate.toUpperCase()}\n\n`;
  message += `🔹 *Payable Amount:* ₹${amount}\n\n`;
  message += `🔹 *Address:* ${address.toUpperCase()}\n\n`;
  message += `🔹 *Phone:* ${phone}\n\n`;
  message += `🔹 *Postal Code:* ${postalCode}\n\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  message += `⚠️ *IMPORTANT NOTE:*\n`;
  message += `Only prasad will be delivered to your address.\n`;
  message += `(Puja will not be performed in your name)\n\n`;
  message += `🙏 Thank you for choosing ${templetName.toUpperCase()}!`;

  return message;
};

export const completePackageName = () => {};

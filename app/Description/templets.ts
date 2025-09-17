import { prasadamOnlyFormProps } from "./types";

export type PrasadamProps<T> = {
  [K in keyof typeof prasadamOnlyFormProps as `${(typeof prasadamOnlyFormProps)[K]}`]: T;
};

export interface MultiUserPrasadamProps {
  users: {
    userName: string;
    gotra: string;
    phone: string;
    address: string;
    postalCode: string;
  }[];
  templetName: string;
  pujaName: string;
  amount: string;
  lastDate: string;
  packageName: string;
}
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
export const multiUserPrasadamTemplate = (props: MultiUserPrasadamProps) => {
  const { users, templetName, pujaName, amount, lastDate, packageName } = props;

  let message = `🙏 *PUJA BOOKING CONFIRMATION*\n\n`;
  message += `Welcome to *${templetName.toUpperCase()}*.\n\n`;
  message += `✨ *PUJA DETAILS:*\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  message += `🔹 *Puja:* ${pujaName.toUpperCase()}\n\n`;
  message += `🔹 *Package:* ${packageName.toUpperCase()}\n\n`;
  message += `🔹 *Date & Time:* ${lastDate.toUpperCase()}\n\n`;
  message += `🔹 *Total Amount:* ₹${amount}\n\n`;
  message += `🔹 *Number of Devotees:* ${users.length}\n\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;

  message += `👥 *DEVOTEE DETAILS:*\n\n`;

  users.forEach((user, index) => {
    message += `*Devotee ${index + 1}:*\n`;
    message += `📋 Name: ${user.userName.toUpperCase()}\n`;
    if (user.gotra) {
      message += `🏛️ Gotra: ${user.gotra.toUpperCase()}\n`;
    }
    message += `📱 Phone: ${user.phone}\n`;
    message += `🏠 Address: ${user.address.toUpperCase()}\n`;
    message += `📮 Postal Code: ${user.postalCode}\n\n`;
  });

  message += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  message += `⚠️ *IMPORTANT NOTES:*\n`;
  message += `• Puja will be performed for all mentioned devotees\n`;
  message += `• Prasad will be delivered to the first devotee's address\n`;
  message += `• Please ensure all details are correct\n\n`;
  message += `🙏 Thank you for choosing ${templetName.toUpperCase()}!\n`;
  message += `May Lord bless all devotees! 🕉️`;

  return message;
};

// You can also create a simple single user template that works with the stepper
export const stepperUserTemplate = (
  user: {
    userName: string;
    gotra: string;
    phone: string;
    address: string;
    postalCode: string;
  },
  templateDetails: {
    templetName: string;
    pujaName: string;
    amount: string;
    lastDate: string;
    packageName: string;
  }
) => {
  const props: PrasadamProps<string> = {
    userName: user.userName,
    templetName: templateDetails.templetName,
    pujaName: templateDetails.pujaName,
    amount: templateDetails.amount,
    lastDate: templateDetails.lastDate,
    address: user.address,
    gotra: user.gotra,
    phone: user.phone,
    postalCode: user.postalCode,
  };

  return prasadamTemplate(props);
};

export const completePackageName = () => {};

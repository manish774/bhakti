import Form from "@/components/Form/Form";
import Stepper from "@/components/stepper/Stepper";
import { Dispatch, SetStateAction } from "react";
import { View } from "react-native";
import { Text } from "react-native-paper";
import { PrasadamProps, prasadamTemplate } from "./templets";
import { prasadamOnlyFormProps } from "./types";
import { createPackageSteps, openWhatsApp } from "./utils";

interface PrasadamFormProps {
  isFormCompleted: boolean;
  setShowModel: Dispatch<SetStateAction<boolean>>;
  templeName: string;
  amount: string;
  nos: number | undefined;
  lastDate: string;
  pujaName: string;
}

const pradadamObj = [
  {
    name: prasadamOnlyFormProps["userName"],
    mandatory: true,
    type: "text" as const,
    placeholder: "Enter Your Name",
  },
  {
    name: prasadamOnlyFormProps["phone"],
    mandatory: true,
    type: "number" as const,
    placeholder: "Enter Your Contact no.",
    minLength: 10,
    maxLength: 10,
  },
  {
    name: prasadamOnlyFormProps["address"],
    mandatory: true,
    type: "text" as const,
    placeholder: "Enter you complete address",
  },
  {
    name: prasadamOnlyFormProps["postalCode"],
    mandatory: true,
    type: "number" as const,
    placeholder: "Enter Your Postal code",
    minLength: 6,
    maxLength: 8,
  },
];
export const PrasadamForm: React.FC<PrasadamFormProps> = ({
  amount,
  templeName,
  lastDate,
  setShowModel,
  pujaName,
}) => {
  return (
    <Form>
      {pradadamObj.map((obj) => {
        return <Form.Input {...obj} key={obj.name} />;
      })}

      <Form.Submit
        onPress={(e: PrasadamProps<string>) => {
          const props: PrasadamProps<string> = {
            userName: e.userName,
            templetName: templeName,
            pujaName: pujaName,
            amount: amount,
            lastDate: lastDate,
            address: e.address,
            gotra: e.gotra,
            phone: e.phone,
            postalCode: e.postalCode,
          };
          const detail = prasadamTemplate(props);

          openWhatsApp({ message: detail });
          setTimeout(() => setShowModel(false), 100);
        }}
      >
        Book
      </Form.Submit>
    </Form>
  );
};

// export const UserForm = ({
//   isFormCompleted,
//   setShowModel,
// }: {
//   isFormCompleted: boolean;
//   setShowModel: Dispatch<SetStateAction<boolean>>;
// }) => {
//   return (
//     <Form>
//       <Form.Input name="username" placeholder={"Enter Your Name"} mandatory />
//       <Form.Input
//         name="phone"
//         placeholder={"Phone Number"}
//         type={"numeric"}
//         mandatory
//       />
//       <Form.Submit
//         onPress={() => {
//           if (isFormCompleted) {
//             // openWhatsApp({
//             //   name: userEmail,
//             //   userPhone: userPhone,
//             //   selectedDevoteeType,
//             //   item,
//             // });
//           } else {
//             VibrationManager.error();
//           }

//           setTimeout(() => setShowModel(false), 100);
//         }}
//       >
//         Book
//       </Form.Submit>
//     </Form>
//   );
// };

export const PackageForm: React.FC<PrasadamFormProps> = ({
  amount,
  templeName,
  lastDate,
  setShowModel,
  pujaName,
  nos,
}) => {
  const detail = (
    <View>
      <Text>Temple Name: {templeName}</Text>
      <Text>Puja Name: {pujaName}</Text>
      <Text>Amount: {amount}</Text>
    </View>
  );

  return (
    <Form>
      <Stepper steps={createPackageSteps(nos as number, detail)} />
    </Form>
  );
};

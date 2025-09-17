import Form from "@/components/Form/Form";
import Stepper, { FormProps } from "@/components/stepper/Stepper";
import { Dispatch, SetStateAction } from "react";
import { PrasadamProps, prasadamTemplate } from "./templets";
import { prasadamOnlyFormProps } from "./types";
import { openWhatsApp } from "./utils";

interface PrasadamFormProps {
  isFormCompleted: boolean;
  setShowModel: Dispatch<SetStateAction<boolean>>;
  templeName: string;
  amount: string;
  nos: number;
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
}) => {
  return (
    <Form>
      {/* {pradadamObj.map((obj) => {
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
      </Form.Submit> */}
      <Stepper
        steps={[
          {
            name: "step1",
            visible: true,
            isValid: (props: FormProps[]): boolean => {
              return !props.every((x) => x.value !== "");
            },
            formProps: [
              {
                id: 1,
                name: "name",
                type: "text",
                placeholder: "Enter your name",
                mandatory: true,
                minLength: 2,
                value: "",
              },
              {
                id: 2,
                name: "password",
                type: "password",
                placeholder: "Enter password.",
                mandatory: true,
                minLength: 6,
                value: "",
              },
            ],
            descriptionForm: null,
          },
          {
            name: "step2",

            visible: false,
            isValid: (props: FormProps[]): boolean => {
              return !props.every((x) => x.value !== "");
            },
            formProps: [
              {
                id: 3,
                name: "email",
                type: "email",
                placeholder: "Enter your email",
                mandatory: true,
                value: "",
              },
              {
                id: 4,
                name: "phone",
                type: "phone",
                placeholder: "Enter phone number",
                mandatory: false,
                maxLength: 10,
                value: "",
              },
            ],
            descriptionForm: null,
          },
          {
            name: "step3",

            visible: false,
            isValid: (props: any): boolean => {
              return false;
            },
            descriptionForm: "Final step description",
          },
          {
            name: "step4",

            visible: false,
            isValid: (props: FormProps[]): boolean => {
              return !props.every((x) => x.value !== "");
            },
            formProps: [
              {
                id: 3,
                name: "email",
                type: "email",
                placeholder: "Enter your email",
                mandatory: true,
                value: "",
              },
              {
                id: 4,
                name: "phone",
                type: "phone",
                placeholder: "Enter phone number",
                mandatory: false,
                maxLength: 10,
                value: "",
              },
            ],
            descriptionForm: null,
          },
        ]}
      />
    </Form>
  );
};

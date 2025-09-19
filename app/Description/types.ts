export enum prasadamOnlyFormProps {
  userName = "userName",
  templetName = "templetName",
  pujaName = "pujaName",
  amount = "amount",
  lastDate = "lastDate",
  address = "address",
  gotra = "gotra",
  phone = "phone",
  postalCode = "postalCode",
}

export type FormProps = {
  name: string;
  type: string;
  placeholder?: string;
  mandatory?: boolean;
  minLength?: number;
  maxLength?: number;
  value: string | number | undefined;
  id: number;
};

export type IStepper = {
  name: string;
  visible: boolean;
  isValid: (props: any) => boolean;
  formProps?: FormProps[] | null;
  descriptionForm?: string | null;
};

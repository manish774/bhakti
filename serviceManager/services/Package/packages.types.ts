export interface PackageProps {
  id?: string;
  _id: string;
  name: string;
  numberOfPerson: number;
  title: string;
  price: number;
  description: {
    id: number;
    detail: string;
  }[];
  isPopular: boolean;
}

export type UpdatePackagePayload = Pick<PackageProps, "id"> &
  Partial<Omit<PackageProps, "id">>;

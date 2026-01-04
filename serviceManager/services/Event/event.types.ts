export interface EventProps {
  id?: string;
  eventName: string;
  templeId: string[];
  packageId: string[];
  pricePackageId: {
    packageId: string;
    price: number;
    discount: number;
  }[];
  isPopular?: boolean;
}

export type UpdateEventPayload = Pick<EventProps, "id"> &
  Partial<Omit<EventProps, "id">>;

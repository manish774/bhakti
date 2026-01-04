// API Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface PujaType {
  id?: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PackageDescription {
  id: number;
  detail: string;
}

export interface Package {
  id: string;
  name: string;
  numberOfPerson: number;
  title: string;
  price: number;
  description: PackageDescription[];
  isPopular: boolean;
}

export interface PrasadDelivery {
  included: boolean;
  deliveryTime: string;
  prasadCharge: number;
}

export interface Pandit {
  name: string;
  about: string;
}

export interface Contact {
  phone: string;
  email: string;
}

export interface ExtraInfo {
  templeTiming: string;
  famousFor: string;
  contact: Contact;
  website: string;
}

export interface Temple {
  _id: string;
  name: string;
  location: string;
  image: string;
  description: string[];
  packages: Package[];
  extraInfo: ExtraInfo;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface TempleResponse {
  success: boolean;
  data: Temple[];
  pagination: {
    current: number;
    total: number;
    count: number;
    totalRecords: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface ILocation {
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  country: string;
  pinCode: string;
}

export interface ITemple {
  _id: string;
  name: string;
  location: ILocation;
  image?: string;
  extraInfo: any;
  description: string[];
  createdAt: Date;
  updatedAt: Date;
  images?: string[];
}

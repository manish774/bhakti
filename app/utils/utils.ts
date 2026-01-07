// Prefer generated map (created by scripts/generate-image-map.js). This avoids
// webpack-specific APIs and works with Metro bundler for React Native.
import { CoreEventIds } from "@/serviceManager/services/CoreEvent/coreevent.types";

let generated: {
  imageMap?: Record<string, any>;
  getImage?: (s?: string) => any;
} = {};
try {
  generated = require("./generatedImageMap");
} catch (e) {
  // If the generated file is missing, the consumer can run the generator:
  // node ./scripts/generate-image-map.js
  console.warn("generatedImageMap not found, images may be missing", e);
}

export const imageMap: Record<string, any> = generated.imageMap || {};
export const getImage =
  generated.getImage ||
  ((f?: string) => (f ? imageMap[f.toLowerCase()] : undefined));

export type RootStackParamList = {
  Home: any;
  Settings: any;
  PujaType: any;
  Description: { id: string | number };
  ForgotPassword: any;
  login: any;
  bookingPage: { id: string; selectedDevotee: Record<string, any> | null };
};

export type ICorePujaType = CoreEventIds;

export interface PujaOption {
  type: ICorePujaType;
  title: string;
  description: string;
  icon: string;
  color: string;
  shadowColor: string;
  visible: boolean;
}

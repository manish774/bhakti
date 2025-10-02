// Prefer generated map (created by scripts/generate-image-map.js). This avoids
// webpack-specific APIs and works with Metro bundler for React Native.
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
  bookingPage: { id: string; selectedDevotee: string };
};

export enum ICorePujaType {
  BOOK_PRASAD = "BOOK_PRASAD",
  BOOK_PUJA = "BOOK_PUJA",
  COMPLETEPUJA = "COMPLETEPUJA",
  BOOK_PUJA_SAMAGRI = "BOOK_PUJA_SAMAGRI",
  BOOK_OFFLINE_PUJA = "BOOK_OFFLINE_PUJA",
}

export interface PujaOption {
  type: ICorePujaType;
  title: string;
  description: string;
  icon: string;
  color: string;
  shadowColor: string;
  visible: boolean;
}

export const pujaOptions: PujaOption[] = [
  {
    type: ICorePujaType.BOOK_PUJA,
    title: "Book Puja",
    description:
      "Personalized puja performed by a priest with your name & gotra. Includes mantra chanting and a recorded video.",
    icon: "🙏",
    color: "#FF6B6B",
    shadowColor: "#FF6B6B",
    visible: true,
  },
  {
    type: ICorePujaType.BOOK_PRASAD,
    title: "Book Prasad",
    description:
      "Get sacred prasad offered during a puja, packed and delivered with divine blessings.",
    icon: "🍯",
    color: "#4ECDC4",
    shadowColor: "#4ECDC4",
    visible: true,
  },
  {
    type: ICorePujaType.BOOK_PUJA_SAMAGRI,
    title: "Book Puja Samagri (Coming soon)",
    description:
      "Order a complete puja samagri kit that includes all essential ritual items like incense, diya, kumkum, rice, and flowers. Ideal for performing your own puja at home.",
    icon: "✨",
    color: "#45B7D1",
    shadowColor: "#45B7D1",
    visible: true,
  },
  {
    type: ICorePujaType.BOOK_OFFLINE_PUJA,
    title: "Book Offline Puja",
    description:
      "Schedule a priest to perform a full traditional puja at your home or venue.",
    icon: "🏠",
    color: "#FFA500",
    shadowColor: "#FFA500",
    visible: true,
  },
];

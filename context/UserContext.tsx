// AuthContext.tsx
import { useAuth as useClerkAuth, useUser } from "@clerk/clerk-expo";
import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

type User = {
  id: string;
  name: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isLoggedIn: boolean;
  isSignedIn: boolean;
  clerkLoaded: boolean;
  selectedThemeIndex: number;
  setThemeIndex: (index: number) => void;
  corePujaType: string;
  setCorePujaType: Dispatch<SetStateAction<ICorePujaType | undefined>>;
};

export enum ICorePujaType {
  BOOK_PRASAD = "BOOK_PRASAD",
  BOOK_PUJA = "BOOK_PUJA",
  COMPLETEPUJA = "COMPLETEPUJA",
  BOOK_PUJA_SAMAGRI = "BOOK_PUJA_SAMAGRI",
  BOOK_OFFLINE_PUJA = "BOOK_OFFLINE_PUJA",
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [selectedThemeIndex, setThemeIndex] = useState(8); // default to Sacred Fire theme
  const [corePujaType, setCorePujaType] = useState<ICorePujaType | undefined>(
    undefined
  );

  // Clerk hooks
  const { isSignedIn, isLoaded: clerkLoaded } = useClerkAuth();
  const { user: clerkUser } = useUser();

  // Sync Clerk user data with local state
  useEffect(() => {
    if (clerkLoaded && isSignedIn && clerkUser) {
      const userData: User = {
        id: clerkUser.id,
        name: clerkUser.fullName || clerkUser.firstName || "User",
        email: clerkUser.primaryEmailAddress?.emailAddress || "",
      };
      setUser(userData);
    } else if (clerkLoaded && !isSignedIn) {
      setUser(null);
    }
  }, [clerkLoaded, isSignedIn, clerkUser]);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isLoggedIn: !!user,
        isSignedIn,
        clerkLoaded,
        selectedThemeIndex,
        setThemeIndex,
        corePujaType,
        setCorePujaType,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// custom hook for easier usage
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

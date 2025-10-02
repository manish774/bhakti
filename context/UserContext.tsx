// AuthContext.tsx
import { ICorePujaType } from "@/app/utils/utils";
import ServiceManager from "@/serviceManager/ServiceManager";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
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
  login: (userData: User) => Promise<void>;
  logout: () => Promise<void>;
  isLoggedIn: boolean;
  isSignedIn: boolean;
  isLoaded: boolean;
  selectedThemeIndex: number;
  setThemeIndex: (index: number) => void;
  corePujaType: string;
  setCorePujaType: Dispatch<SetStateAction<ICorePujaType | undefined>>;
  checkAuthStatus: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USER_DATA: "@bhakti_user_data",
  THEME_INDEX: "@bhakti_theme_index",
  CORE_PUJA_TYPE: "@bhakti_core_puja_type",
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [selectedThemeIndex, setThemeIndex] = useState(8); // default to Sacred Fire theme
  const [corePujaType, setCorePujaType] = useState<ICorePujaType | undefined>(
    undefined
  );
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const service = ServiceManager.getInstance();

  const loadUserData = useCallback(async () => {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      const themeIndex = await AsyncStorage.getItem(STORAGE_KEYS.THEME_INDEX);
      const pujaType = await AsyncStorage.getItem(STORAGE_KEYS.CORE_PUJA_TYPE);

      if (userData) {
        setUser(JSON.parse(userData));
      }
      if (themeIndex) {
        setThemeIndex(parseInt(themeIndex, 10));
      }
      if (pujaType) {
        setCorePujaType(JSON.parse(pujaType));
      }

      // Check if user has valid session with cookie
      const isAuth = await service.isAuthenticated();
      setIsAuthenticated(isAuth);

      // If no local user data but has valid cookie, try to get user info
      if (!userData && isAuth) {
        // You might want to add a getUserInfo API call here
        console.log("Valid session found but no local user data");
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setIsLoaded(true);
    }
  }, [service]);

  // Load user data from AsyncStorage on app start
  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  const login = async (userData: User) => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.USER_DATA,
        JSON.stringify(userData)
      );
      setUser(userData);
    } catch (error) {
      console.error("Error saving user data:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Call server logout to clear cookies
      await service.logout();
      // Clear local storage
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Error during logout:", error);
      // Even if server logout fails, clear local data
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    }
  };

  const checkAuthStatus = async (): Promise<boolean> => {
    try {
      const isAuth = await service.isAuthenticated();
      setIsAuthenticated(isAuth);
      return isAuth;
    } catch (error) {
      console.error("Error checking auth status:", error);
      setIsAuthenticated(false);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isLoggedIn: !!user,
        isSignedIn: !!user || isAuthenticated,
        isLoaded,
        selectedThemeIndex,
        setThemeIndex,
        corePujaType: corePujaType?.toString() || "",
        setCorePujaType,
        checkAuthStatus,
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

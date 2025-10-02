import axios from "axios";
import * as SecureStore from "expo-secure-store";

export enum Core {
  id = "core.id",
  ClassName = "core.className",
  Name = "core.name",
  Description = "core.description",
  PujaDescription = "core.pujaDescription",
  Benifits = "core.benifits",
  Temple = "core.temple",
  MetaData = "core.metaData",
  StartPrice = "core.startPrice",
}

export interface TempleMetadata {
  [Core.id]: string;
  [Core.ClassName]: string;
  [Core.Name]: string;
  [Core.Description]: {
    description: string;
  }[];
  [Core.PujaDescription]: {
    lastDate: string;
    description: string;
    pujaName: string;
    metadata: string;
  };
  [Core.StartPrice]: number;
  [Core.Benifits]: {
    name: string;
    benifit: string;
  }[];
  [Core.Temple]: {
    name: string;
    location: string;
    image: string;
    packages: {
      id: string;
      title: string;
      isPopular: boolean;
      name: string;
      price: number;
      description: { id: string | number; detail: string }[];
    }[];
    prasadDelivery: {
      included: boolean;
      deliveryTime: string;
      prasadCharge: number;
      deliveryCharge?: number;
    };
    pandit: {
      name: string;
      about: string;
    };
    extraInfo: Record<string, any>;
  };
  [Core.MetaData]: Record<string, any>;
}

type SignupProps = {
  name: string;
  email: string;
  password: string;
  phone?: string;
};

type SignupResp = {
  success: boolean;
  data: SignupProps;
  timestamp: string; // ISO date string
};

class ServiceManager {
  private static instance: ServiceManager;
  private templeList: TempleMetadata[];
  private _baseURL: string;

  private constructor() {
    this.templeList = [];
    // Use environment variable or fallback to localhost
    this._baseURL =
      process.env.EXPO_PUBLIC_API_BASE_URL ||
      "http://srv1038411.hstgr.cloud:8080/";
    console.log("ServiceManager initialized with base URL:", this._baseURL);

    // Configure axios defaults
    axios.defaults.headers.common["Content-Type"] = "application/json";

    // Add request interceptor to include auth token
    axios.interceptors.request.use(
      (config) => {
        // Ensure headers exist
        if (!config.headers) {
          config.headers = {};
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor to handle auth errors
    axios.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        // Handle 401 unauthorized - clear token
        if (error.response?.status === 401) {
          this.clearAuthToken();
        }
        return Promise.reject(error);
      }
    );
  }

  public static getInstance() {
    if (!ServiceManager.instance) {
      ServiceManager.instance = new ServiceManager();
    }
    return ServiceManager.instance;
  }

  private mURL(endpoint: string): string {
    return `${this._baseURL}${endpoint}`;
  }

  private async getAuthHeaders(): Promise<{ [key: string]: string }> {
    const headers: { [key: string]: string } = {
      "Content-Type": "application/json",
    };

    try {
      const token = await this.getAuthToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.log("Error getting auth token for headers:", error);
    }

    return headers;
  }

  public async login(props: { email: string; password: string }): Promise<any> {
    const url = this.mURL("api/auth/login");

    try {
      const response: any = await axios.post(url, props, {
        withCredentials: true, // Enable cookies for this request
      });
      console.log(response.data);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  public async getTempleList(): Promise<TempleMetadata[]> {
    return this.templeList;
  }

  public async signup(props: SignupProps): Promise<SignupResp> {
    console.log("Signup called with:", props);
    const url = this.mURL("api/auth/signup");
    console.log("Signup URL:", url);

    try {
      const response: any = await axios.post(url, props);
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  public async verifyOtp({
    otp,
    email,
  }: {
    otp: string;
    email: string;
  }): Promise<any> {
    const url = this.mURL("api/auth/verify-otp");
    try {
      const response: any = await axios.post(
        url,
        { otp, email },
        {
          withCredentials: true, // Enable cookies for this request
        }
      );

      // Extract token from response and store it
      if (response.data && response.data.token) {
        await this.setAuthToken(response.data.token);
      }

      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  // Test method to check if server is reachable
  public async testConnection(): Promise<boolean> {
    try {
      console.log("Testing connection to:", this._baseURL);
      const headers = await this.getAuthHeaders();
      const response = await axios.get(this._baseURL + "health", {
        timeout: 5000,
        headers,
      });
      console.log("Connection test successful:", response.status);
      return true;
    } catch (error: any) {
      console.error("Connection test failed:", error.message);
      return false;
    }
  }

  public async sendOTP(props: { email: string }): Promise<any> {
    const url = this.mURL("api/auth/resendOtp");
    try {
      const headers = await this.getAuthHeaders();
      const response = await axios.post(url, props, { headers });
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }

  // Token management methods
  private readonly TOKEN_KEY = "auth_token";

  public async setAuthToken(token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(this.TOKEN_KEY, token);
      console.log("Auth token stored securely");
    } catch (error) {
      console.log("Error storing auth token:", error);
      throw error;
    }
  }

  public async getAuthToken(): Promise<string | null> {
    try {
      const token = await SecureStore.getItemAsync(this.TOKEN_KEY);
      return token;
    } catch (error) {
      console.log("Error getting auth token:", error);
      return null;
    }
  }

  public async clearAuthToken(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(this.TOKEN_KEY);
      console.log("Auth token cleared");
    } catch (error) {
      console.log("Error clearing token:", error);
    }
  }

  public async isAuthenticated(): Promise<boolean> {
    try {
      const token = await this.getAuthToken();
      return !!token;
    } catch (error) {
      console.log("Error checking authentication status:", error);
      return false;
    }
  }

  public async logout(): Promise<any> {
    try {
      const url = this.mURL("api/auth/logout");
      const response = await axios.post(
        url,
        {},
        {
          withCredentials: true, // Send cookies to server for logout
        }
      );
      // Clear local token after successful logout
      await this.clearAuthToken();
      return response.data;
    } catch (error: any) {
      // Even if logout fails on server, clear local token
      await this.clearAuthToken();
      throw error;
    }
  }
}
export default ServiceManager;

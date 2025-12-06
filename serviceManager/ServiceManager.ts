import axios from "axios";
import * as SecureStore from "expo-secure-store";

export enum Core {
  id = "id",
  ClassName = "className",
  Name = "name",
  Description = "description",
  PujaDescription = "pujaDescription",
  Benifits = "benifits",
  Temple = "temple",
  MetaData = "metaData",
  StartPrice = "startPrice",
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

// New interface matching the actual API response structure
export interface ApiTempleResponse {
  _id: string;
  name: string;
  location: string;
  image: string;
  packages: {
    id: string;
    name: string;
    numberOfPerson: number;
    title: string;
    price: number;
    description: {
      id: number;
      detail: string;
    }[];
    isPopular: boolean;
  }[];
  prasadDelivery: {
    included: boolean;
    deliveryTime: string;
    prasadCharge: number;
  };
  pandit: {
    name: string;
    about: string;
  };
  extraInfo: {
    templeTiming: string;
    famousFor: string;
    contact: {
      phone: string;
      email: string;
    };
    website: string;
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
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
  private templeList: ApiTempleResponse[];
  private _baseURL: string;
  public _token: string | null = null;

  private constructor() {
    this.templeList = [];
    // Use environment variable or fallback
    this._baseURL =
      process.env.EXPO_PUBLIC_API_BASE_URL || "https://api.jalsuvidha.com/";

    // Configure axios defaults
    axios.defaults.headers.common["Content-Type"] = "application/json";
    axios.defaults.timeout = 30000; // 30 seconds timeout
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

    console.log(this._baseURL, "login url");
    try {
      console.log("Attempting login to :", url);
      const response: any = await axios.post(url, props, {
        withCredentials: true, // Enable cookies for this request
      });
      console.warn(response.data, "response token");
      // set token in a variable
      if (response.data && response.data.data.token) {
        // Styled console output (CSS styling works in browser devtools; not in React Native / Node)
        console.log(
          "%cAuth Token:%c %s",
          "background:#222;color:#fff;padding:4px 8px;border-radius:3px;font-weight:700;",
          "color:#7fffd4;padding-left:8px;",
          response.data.token
        );
        await this.setAuthToken(response.data.data.token);
      }
      console.log("Login successful:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Login failed:", error);
      const userFriendlyMessage = this.getNetworkErrorMessage(error);
      throw new Error(userFriendlyMessage);
    }
  }

  public async getTempleList(): Promise<ApiTempleResponse[]> {
    return this.templeList;
  }

  public async signup(props: SignupProps): Promise<SignupResp> {
    console.log("Signup called with:", props);
    const url = this.mURL("api/auth/signup");
    console.log("Signup URL:", url);

    try {
      const response: any = await axios.post(url, props);
      console.log("Signup successful:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Signup failed:", error);
      const userFriendlyMessage = this.getNetworkErrorMessage(error);
      throw new Error(userFriendlyMessage);
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
    const testUrls = [
      this._baseURL + "health",
      this._baseURL + "api/health",
      this._baseURL,
      this._baseURL + "api",
    ];

    console.log("=== Testing Server Connection ===");
    console.log("Base URL:", this._baseURL);

    for (const testUrl of testUrls) {
      try {
        console.log(`Testing: ${testUrl}`);
        const headers = await this.getAuthHeaders();
        const response = await axios.get(testUrl, {
          timeout: 10000,
          headers,
        });
        console.log(`✅ SUCCESS: ${testUrl} - Status: ${response.status}`);
        console.log("Response data:", response.data);
        return true;
      } catch (error: any) {
        console.log(`❌ FAILED: ${testUrl}`);
        console.log("Error details:", {
          message: error.message,
          code: error.code,
          status: error.response?.status,
          statusText: error.response?.statusText,
          isNetworkError: error.code === "NETWORK_ERROR" || !error.response,
        });
      }
    }

    console.log("All connection tests failed");
    return false;
  }

  // Helper method to provide user-friendly error messages
  private getNetworkErrorMessage(error: any): string {
    if (error.code === "NETWORK_ERROR" || !error.response) {
      return "Network connection failed. Please check your internet connection and try again.";
    }

    return (
      error.response?.data?.error?.message ||
      error.message ||
      "An unexpected error occurred."
    );
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
      this._token = token;
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
      return this._token || token;
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
      const response = await axios.get(url);
      // Clear local token after successful logout
      await this.clearAuthToken();
      return response.data;
    } catch (error: any) {
      // Even if logout fails on server, clear local token
      await this.clearAuthToken();
      throw error;
    }
  }

  //Templedata

  public async fetchTempleData(templeId: string): Promise<TempleMetadata> {
    const url = this.mURL(`api/admin/temples/${templeId}`);
    try {
      const headers = await this.getAuthHeaders();
      const response = await axios.get(url, { headers });
      return response.data as TempleMetadata;
    } catch (error: any) {
      console.error("Fetch temple data failed :", error);
      const userFriendlyMessage = this.getNetworkErrorMessage(error);
      throw new Error(userFriendlyMessage);
    }
  }

  public async fetchAllTemples({
    limit,
    page,
  }: {
    limit: number;
    page: number;
  }): Promise<ApiTempleResponse[]> {
    const url = this.mURL(`api/admin/temples?limit=${limit}&page=${page}`);
    try {
      const headers = await this.getAuthHeaders();

      console.log(headers, "headers");
      const response = await axios.get(url, { headers });
      // The API returns an array directly, not wrapped in a data property
      this.templeList = response.data as ApiTempleResponse[];
      console.log(response.data, "temple data");
      return this.templeList;
    } catch (error: any) {
      console.error("Fetch all temples failed :", error);
      const userFriendlyMessage = this.getNetworkErrorMessage(error);
      throw new Error(userFriendlyMessage);
    }
  }
}
export default ServiceManager;

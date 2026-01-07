// apiClient.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import AuthEventEmitter from "./AuthEvents";

const apiClient = axios.create({
  baseURL: "https://api.jalsuvidha.com/", // Use proxy path in development
  headers: {
    "Content-Type": "application/json",
  },
  //withCredentials: true, // Include credentials for CORS requests
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config: any) => {
    return AsyncStorage.getItem("authToken").then((token) => {
      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
      }
      return config;
    });
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    if (status === 401 || status === 403) {
      // Clear the token and notify the app to log out and redirect
      await AsyncStorage.removeItem("authToken");
      AuthEventEmitter.getInstance().emit("authExpired");
      console.warn(
        `Authentication failed with status ${status}. Token cleared and logout emitted.`
      );
    }
    return Promise.reject(error);
  }
);

export default apiClient;

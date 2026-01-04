// apiClient.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://api.jalsuvidha.com/", // Use proxy path in development
  headers: {
    "Content-Type": "application/json",
  },
  //withCredentials: true, // Include credentials for CORS requests
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("authToken");
    if (token) {
      config.headers = { ...config.headers, Authorization: `Bearer ${token}` };
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Clear the token but don't force reload in development
      await AsyncStorage.removeItem("authToken");
      // Let the app handle the redirect instead of forcing a page reload
      console.warn("Authentication failed. Token cleared.");
    }
    return Promise.reject(error);
  }
);

export default apiClient;

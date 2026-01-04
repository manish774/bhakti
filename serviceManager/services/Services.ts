import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import type {
  ApiResponse,
  LoginCredentials,
  Package,
  PujaType,
  Temple,
} from "../types/api";
import DashboardEventEmitter from "./DashboardEvents";
import apiClient from "./interceptor";

class Services {
  private static instance: Services;

  public static getInstance() {
    if (!this.instance) {
      this.instance = new Services();
    }
    return this.instance;
  }

  public async getAllTemples(): Promise<Temple[]> {
    const response = await apiClient.get("/api/admin/temples");
    // Handle the nested response structure
    if (response.data && response.data.data && response.data.data.data) {
      return response.data.data.data;
    }
    return response.data?.data || response.data || [];
  }

  addToFormData<T extends Record<string, any>>(obj: T): FormData {
    const formData = new FormData();

    const flatten = (data: any, prefix = "") => {
      for (const [key, value] of Object.entries(data)) {
        const formKey = prefix ? `${prefix}.${key}` : key;

        if (value === null || value === undefined) {
          formData.append(formKey, "");
        } else if (Array.isArray(value)) {
          value.forEach((item, index) => {
            if (typeof item === "object" && item !== null) {
              flatten(item, `${formKey}[${index}]`);
            } else {
              formData.append(`${formKey}[${index}]`, String(item));
            }
          });
        } else if (typeof value === "object" && !(value instanceof Date)) {
          flatten(value, formKey);
        } else {
          formData.append(formKey, String(value));
        }
      }
    };

    flatten(obj);
    return formData;
  }

  public async addTemple(
    templeData: Omit<Temple, "_id" | "createdAt" | "updatedAt" | "__v">
  ): Promise<Temple> {
    //const file = this.addToFormData(templeData, true);
    const formData = this.addToFormData(templeData);
    const response = await apiClient.post("/api/admin/temples", formData);

    // Emit event to notify dashboard of data change
    DashboardEventEmitter.getInstance().emit("templesUpdated");

    return response.data;
  }

  public async updateTemple(
    templeId: string,
    templeData: Partial<Temple>
  ): Promise<Temple> {
    const response = await apiClient.put(
      `/api/admin/temples/${templeId}`,
      templeData
    );

    return response.data;
  }

  public async deleteTemple(templeId: string): Promise<{ success: boolean }> {
    const response = await apiClient.delete(`/api/admin/temples/${templeId}`);

    // Emit event to notify dashboard of data change
    DashboardEventEmitter.getInstance().emit("templesUpdated");

    return response.data;
  }

  public async addPackage(
    templeId: string,
    packageData: Omit<Package, "id">
  ): Promise<Temple> {
    const response = await apiClient.post(
      `/api/admin/temples/${templeId}/packages`,
      packageData
    );

    // Emit event to notify dashboard of data change
    DashboardEventEmitter.getInstance().emit("templesUpdated");

    return response.data;
  }

  public async deletePackage(
    templeId: string,
    packageId: string
  ): Promise<{ success: boolean }> {
    const response = await apiClient.delete(
      `/api/admin/temples/${templeId}/packages/${packageId}`
    );

    // Emit event to notify dashboard of data change
    DashboardEventEmitter.getInstance().emit("templesUpdated");

    return response.data;
  }

  public async login(
    credentials: LoginCredentials
  ): Promise<ApiResponse<{ token: string; _doc: object }>> {
    const response = await apiClient.post("/api/auth/login", credentials);

    // Store the token in AsyncStorage for future requests
    if (response.data.data.token) {
      await AsyncStorage.setItem("authToken", response.data.data.token);
      if (Platform.OS === "web") {
        document.cookie = `token=${response.data.data.token}; path=/; secure; samesite=strict`;
      }
    }

    return response.data;
  }

  // Additional methods for puja types
  public async getAllPujaTypes(): Promise<PujaType[]> {
    const response = await apiClient.get("/api/admin/puja-types");
    return response.data;
  }

  public async createPujaType(
    pujaTypeData: Omit<PujaType, "id" | "createdAt" | "updatedAt">
  ): Promise<PujaType> {
    const response = await apiClient.post(
      "/api/admin/puja-types",
      pujaTypeData
    );
    return response.data;
  }

  public async updatePujaType(
    id: string,
    pujaTypeData: Partial<PujaType>
  ): Promise<PujaType> {
    const response = await apiClient.put(
      `/api/admin/puja-types/${id}`,
      pujaTypeData
    );
    return response.data;
  }

  public async deletePujaType(id: string): Promise<{ success: boolean }> {
    const response = await apiClient.delete(`/api/admin/puja-types/${id}`);
    return response.data;
  }

  public async getProfile(): Promise<
    ApiResponse<{ name: string; email: string }>
  > {
    const response = await apiClient.get("/api/profile/profile");
    return response.data;
  }

  public async checkAuthToken(): Promise<string | null> {
    // Check AsyncStorage first
    const token = await AsyncStorage.getItem("authToken");
    if (token) {
      return token;
    }

    if (Platform.OS === "web") {
      // Check cookies as backup
      const cookieMatch = document.cookie
        .split(";")
        .find((cookie) => cookie.trim().startsWith("token="));

      if (cookieMatch) {
        return cookieMatch.split("=")[1];
      }
    }

    return null;
  }

  public async restoreUserSession(): Promise<{
    name: string;
    email: string;
  } | null> {
    const token = await this.checkAuthToken();

    if (!token) {
      return null;
    }

    try {
      const profileResponse = await this.getProfile();
      return profileResponse.data;
    } catch (error) {
      // If profile fetch fails, clear invalid token
      console.error("Failed to restore session:", error);
      await AsyncStorage.removeItem("authToken");
      if (Platform.OS === "web") {
        document.cookie =
          "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
      return null;
    }
  }

  async uploadSingleImage(
    file: File
  ): Promise<{ url: string; filename: string }> {
    const formData = new FormData();
    formData.append("image", file);

    const response = await apiClient.post("/api/upload/single", formData, {
      headers: {
        // allow axios/browser to set multipart boundary automatically
        "Content-Type": undefined as unknown as string,
      },
      withCredentials: true,
    });

    // Support different response shapes (raw body or wrapped in `data`)
    const payload = response.data?.data ?? response.data;
    const uploadedFile = payload?.file ?? payload;
    if (!uploadedFile) {
      throw new Error("Invalid upload response");
    }

    return {
      url: uploadedFile.url,
      filename: uploadedFile.filename,
    };
  }

  async uploadMultipleImages(
    files: File[]
  ): Promise<{ url: string; filename: string }[]> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images", file);
    });

    const response = await apiClient.post("/api/upload/multiple", formData, {
      headers: {
        "Content-Type": undefined as unknown as string,
      },
      withCredentials: true,
    });

    const payload = response.data?.data ?? response.data;
    const uploadedFiles = payload?.files ?? payload;
    if (!Array.isArray(uploadedFiles)) {
      throw new Error("Invalid upload response");
    }

    return uploadedFiles.map((f: any) => ({
      url: f.url,
      filename: f.filename,
    }));
  }

  public async addImage(
    file: File,
    templeId?: string
  ): Promise<{ url: string; filename: string }> {
    const formData = new FormData();
    formData.append("image", file);

    const response = await apiClient.post(
      templeId
        ? `api/admin/temples/upload/single/${templeId}`
        : `api/admin/temples/upload/single`,
      formData,
      {
        headers: {
          // allow axios/browser to set multipart boundary automatically
          "Content-Type": undefined as unknown as string,
        },
        withCredentials: true,
      }
    );

    // Support different response shapes (raw body or wrapped in `data`)
    const payload = response.data?.data ?? response.data;
    const uploadedFile = payload?.data ?? payload;
    if (!uploadedFile) {
      throw new Error("Invalid upload response");
    }

    return {
      url: uploadedFile.url,
      filename: uploadedFile.filename,
    };
  }
}
export default Services;

import apiClient from "../interceptor";
import type { PackageProps, UpdatePackagePayload } from "./packages.types";

export const PackageAPI = {
  getPackages: async (): Promise<PackageProps[]> => {
    const result = await apiClient.get("api/package/get");
    if (!result) throw Error("Some issue");
    // Normalize response shape: API may return { data: { data: [...] } } or just an array
    const payload = (result as any)?.data;
    const packages = payload?.data?.data ?? payload?.data ?? payload ?? [];
    return packages as PackageProps[];
  },
  getByIds: async ({ ids }: { ids: string[] }): Promise<PackageProps[]> => {
    const result = await apiClient.post("api/package/getByIds", { ids });
    if (!result) throw Error("Some issue");
    const payload = (result as any)?.data;
    const packages = payload?.data?.data ?? payload?.data ?? payload ?? [];
    return packages as PackageProps[];
  },
  createPackage: async (
    payload: PackageProps
  ): Promise<PackageProps | null> => {
    const result = await apiClient.post("api/package/create", { ...payload });
    const payloadData = (result as any)?.data;
    const ev =
      payloadData?.data?.data ?? payloadData?.data ?? payloadData ?? null;
    return ev as PackageProps | null;
  },
  deletePackage: async ({
    id,
  }: {
    id: string;
  }): Promise<PackageProps | null> => {
    //@ts-expect-error expected
    const result = await apiClient.delete("api/package/delete", { id: id });
    const payloadData = (result as any)?.data;
    const ev =
      payloadData?.data?.data ?? payloadData?.data ?? payloadData ?? null;
    return ev as PackageProps | null;
  },
  updatePackage: async (
    payload: UpdatePackagePayload
  ): Promise<PackageProps | null> => {
    const result = await apiClient.patch("api/package/update", { ...payload });
    const payloadData = (result as any)?.data;
    const ev =
      payloadData?.data?.data ?? payloadData?.data ?? payloadData ?? null;
    return ev as PackageProps | null;
  },
};

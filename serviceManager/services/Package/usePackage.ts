import { useCallback, useEffect, useState } from "react";
import { PackageController } from "./packages.controller";
import type { PackageProps } from "./packages.types";

interface UsePackageState {
  packages: PackageProps[];
  loading: boolean;
  error: string | null;
}

interface UsePackageReturn extends UsePackageState {
  refetch: () => Promise<PackageProps[]>;
  fetchPackages: () => Promise<PackageProps[]>;
  fetchPackageByIDs: (ids: string[]) => Promise<PackageProps[]>;
  create: (payload: PackageProps) => Promise<PackageProps | null>;
  update: (payload: PackageProps) => Promise<PackageProps | null>;
  remove: ({ id }: { id: string }) => Promise<PackageProps | null>;
}

export const usePackage = ({
  autoFetch = true,
}: {
  autoFetch: boolean;
}): UsePackageReturn => {
  const [state, setState] = useState<UsePackageState>({
    packages: [],
    loading: autoFetch,
    error: null,
  });

  const controller = PackageController.getInstance();

  const fetchPackages = useCallback(async (): Promise<PackageProps[]> => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const packages = await controller.getPackages();
      setState((prev) => ({ ...prev, loading: false, packages }));
      return packages;
    } catch (err) {
      setState((prev) => ({
        ...prev,
        packages: [],
        loading: false,
        error: err instanceof Error ? err.message : "Failed to fetch packages",
      }));
      return [];
    }
  }, [controller]);

  const create = useCallback(
    async (payload: PackageProps): Promise<PackageProps | null> => {
      setState((prev) => ({ ...prev, loading: true }));
      try {
        const created = await controller.createPackage(payload);
        setState((prev) => ({ ...prev, loading: false, error: "" }));
        return created;
      } catch (err) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error:
            err instanceof Error ? err.message : "Failed to create package",
        }));
        return null;
      }
    },
    [controller]
  );

  const remove = useCallback(
    async ({ id }: { id: string }): Promise<PackageProps | null> => {
      setState((prev) => ({ ...prev, loading: true }));
      try {
        const deleted = await controller.deletePackage({ id });
        setState((prev) => ({ ...prev, loading: false }));
        return deleted;
      } catch (err) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error:
            err instanceof Error ? err.message : "Failed to delete package",
        }));
        return null;
      }
    },
    [controller]
  );

  const update = useCallback(
    async (payload: PackageProps): Promise<PackageProps | null> => {
      setState((prev) => ({ ...prev, loading: true }));
      try {
        const updated = await controller.updatePackage(payload);
        setState((prev) => ({ ...prev, loading: false }));
        return updated;
      } catch (err) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error:
            err instanceof Error ? err.message : "Failed to update package",
        }));
        return null;
      }
    },
    [controller]
  );

  const fetchPackageByIDs = useCallback(
    async (ids: string[]): Promise<PackageProps[]> => {
      setState((prev) => ({ ...prev, loading: true }));
      try {
        const packages = await controller.getByIds({ ids });
        setState((prev) => ({ ...prev, loading: false, packages }));
        return packages;
      } catch (err) {
        setState((prev) => ({
          ...prev,
          packages: [],
          loading: false,
          error:
            err instanceof Error ? err.message : "Failed to fetch packages",
        }));
        return [];
      }
    },
    [controller]
  );

  useEffect(() => {
    if (autoFetch) {
      fetchPackages();
    }
  }, [autoFetch, fetchPackages]);

  return {
    ...state,
    refetch: fetchPackages,
    fetchPackageByIDs,
    fetchPackages,
    create,
    remove,
    update,
  };
};

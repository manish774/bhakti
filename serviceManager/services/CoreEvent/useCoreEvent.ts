import { useCallback, useEffect, useState } from "react";
import { CoreEventController } from "./coreevent.controller";
import type { CoreEventProps } from "./coreevent.types";

interface UseCoreEventState {
  coreEvents: CoreEventProps[];
  loading: boolean;
  error: string | null;
}

interface UseCoreEventReturn extends UseCoreEventState {
  refetch: () => Promise<void>;
  fetch: () => Promise<void>;
  remove: ({ id }: { id: string }) => Promise<CoreEventProps | null>;
}

export const useCoreEvent = ({
  autoFetch = true,
}: {
  autoFetch: boolean;
}): UseCoreEventReturn => {
  const [state, setState] = useState<UseCoreEventState>({
    coreEvents: [],
    loading: autoFetch,
    error: null,
  });

  const controller = CoreEventController.getInstance();

  const fetch = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }));
    try {
      const data = await controller.getCoreEvents();

      setState((prev) => ({
        ...prev,
        loading: false,
        //@ts-expect-error expected
        coreEvents: data.data?.data || data.data || data,
      }));
    } catch (err) {
      console.log(err);
      setState((prev) => ({
        ...prev,
        coreEvents: [],
        loading: false,
        error:
          err instanceof Error ? err.message : "Failed to fetch Core Events",
      }));
    }
  }, [controller]);

  const remove = useCallback(
    async ({ id }: { id: string }): Promise<CoreEventProps> => {
      setState((prev) => ({ ...prev, loading: true }));
      try {
        const deleted = await controller.deleteCoreEvent({ id });
        setState((prev) => ({ ...prev, loading: false }));
        return deleted;
      } catch (err) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error:
            err instanceof Error ? err.message : "Failed to delete Core Event",
        }));
      }
    },
    [controller]
  );

  useEffect(() => {
    if (autoFetch) {
      fetch();
    }
  }, [autoFetch, fetch]);

  return {
    ...state,
    refetch: fetch,
    fetch,
    remove,
  };
};

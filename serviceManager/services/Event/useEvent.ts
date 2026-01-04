import { useCallback, useEffect, useState } from "react";
import { EventController } from "./event.controller";
import type { EventProps } from "./event.types";

interface UseEventState {
  events: EventProps[];
  loading: boolean;
  error: string | null;
}

type pageLimit = {
  page?: number | number;
  limit?: number | number;
};

interface UseEventReturn extends UseEventState {
  refetch: (props: pageLimit) => Promise<EventProps[]>;
  fetchEvents: (props: pageLimit | {}) => Promise<EventProps[]>;
  create: (payload: EventProps) => Promise<EventProps | null>;
  update: (payload: EventProps) => Promise<EventProps | null>;
  remove: ({ id }: { id: string }) => Promise<EventProps | null>;
}

export const useEvent = ({
  autoFetch = true,
}: {
  autoFetch: boolean;
}): UseEventReturn => {
  const [state, setState] = useState<UseEventState>({
    events: [],
    loading: autoFetch,
    error: null,
  });
  const controller = EventController.getInstance();

  const fetchEvents = useCallback(
    async (props: pageLimit): Promise<EventProps[]> => {
      setState((prev) => ({ ...prev, loading: true }));
      try {
        const events = await controller.getEvents(props);
        console.log(events, "............");
        setState((prev) => ({ ...prev, loading: false, events }));
        return events;
      } catch (err) {
        setState((prev) => ({
          ...prev,
          events: [],
          loading: false,
          error: err instanceof Error ? err.message : "Failed to fetch Events",
        }));
        return [];
      }
    },
    [controller]
  );

  const create = useCallback(
    async (payload: EventProps): Promise<EventProps | null> => {
      setState((prev) => ({ ...prev, loading: true }));
      try {
        const created = await controller.createEvent(payload);
        setState((prev) => ({ ...prev, loading: false, error: "" }));
        return created;
      } catch (err) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: err instanceof Error ? err.message : "Failed to create Events",
        }));
        return null;
      }
    },
    [controller]
  );

  const remove = useCallback(
    async ({ id }: { id: string }): Promise<EventProps | null> => {
      setState((prev) => ({ ...prev, loading: true }));
      try {
        const deleted = await controller.deleteEvent({ id });
        setState((prev) => ({ ...prev, loading: false }));
        return deleted;
      } catch (err) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error:
            err instanceof Error ? err.message : "Failed to delete packages",
        }));
        return null;
      }
    },
    [controller]
  );
  const update = useCallback(
    async (payload: EventProps): Promise<EventProps | null> => {
      setState((prev) => ({ ...prev, loading: true }));
      try {
        const updated = await controller.updateEvent(payload);
        setState((prev) => ({ ...prev, loading: false }));
        return updated;
      } catch (err) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: err instanceof Error ? err.message : "Failed to update Event",
        }));
        return null;
      }
    },
    [controller]
  );

  useEffect(() => {
    if (autoFetch) {
      // fetchEvents returns the fetched events array
      fetchEvents({ page: undefined, limit: undefined });
    }
  }, [autoFetch, fetchEvents]);

  return {
    ...state,
    refetch: fetchEvents,
    create,
    fetchEvents,
    remove,
    update,
  };
};

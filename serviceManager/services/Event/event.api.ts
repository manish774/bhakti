import apiClient from "../interceptor";
import type { EventProps, UpdateEventPayload } from "./event.types";

export const EventAPI = {
  getEvents: async (props: {
    page?: number;
    limit?: number;
  }): Promise<EventProps[]> => {
    const result = await apiClient.get(
      `api/event/get?page=${props.page}&limit=${props.limit}`
    );
    console.log(result, "resuult");
    if (!result) throw Error("Some issue");
    // Normalize response shape: API may return { data: { data: [...] } } or just an array
    const payload = (result as any)?.data;
    const events = payload?.data?.data ?? payload?.data ?? payload ?? [];
    return events as EventProps[];
  },
  createEvent: async (payload: EventProps): Promise<EventProps | null> => {
    const result = await apiClient.post("api/event/create", { ...payload });
    const payloadData = (result as any)?.data;
    const ev =
      payloadData?.data?.data ?? payloadData?.data ?? payloadData ?? null;
    return ev as EventProps | null;
  },
  deleteEvent: async ({ id }: { id: string }): Promise<EventProps | null> => {
    //@ts-expect-error expected
    const result = await apiClient.delete("api/event/delete", { id: id });
    const payloadData = (result as any)?.data;
    const ev =
      payloadData?.data?.data ?? payloadData?.data ?? payloadData ?? null;
    return ev as EventProps | null;
  },
  updateEvent: async (
    payload: UpdateEventPayload
  ): Promise<EventProps | null> => {
    const result = await apiClient.patch("api/event/update", { ...payload });
    const payloadData = (result as any)?.data;
    const ev =
      payloadData?.data?.data ?? payloadData?.data ?? payloadData ?? null;
    return ev as EventProps | null;
  },
};

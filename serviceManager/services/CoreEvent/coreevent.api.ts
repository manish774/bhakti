import apiClient from "../interceptor";
import type { CoreEventProps } from "./coreevent.types";

export const CoreEventAPI = {
  getCoreEvents: async (): Promise<CoreEventProps[]> => {
    const result = await apiClient.get("api/coreevent/get");
    console.log(result);
    if (!result) throw Error("Some issue");
    return result.data;
  },
  deleteCoreEvent: async ({ id }: { id: string }): Promise<CoreEventProps> => {
    //@ts-expect-error expected
    const result = await apiClient.delete("api/coreevent/delete", { id });
    return result.data;
  },
};

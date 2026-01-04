import { EventAPI } from "./event.api";
import type { EventProps } from "./event.types";

export class EventController {
  private static instance: EventController;

  public static getInstance() {
    if (!this.instance) {
      this.instance = new EventController();
    }
    return this.instance;
  }

  async getEvents(props: {
    page?: number;
    limit?: number;
  }): Promise<EventProps[]> {
    return EventAPI.getEvents(props);
  }

  async updateEvent(payload: EventProps): Promise<EventProps> {
    return EventAPI.updateEvent(payload);
  }

  async deleteEvent({ id }: { id: string }): Promise<EventProps> {
    return EventAPI.deleteEvent({ id });
  }

  async createEvent(payload: EventProps): Promise<EventProps> {
    return EventAPI.createEvent(payload);
  }
}

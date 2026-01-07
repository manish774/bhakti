import { CoreEventAPI } from "./coreevent.api";
import type { CoreEventProps } from "./coreevent.types";

export class CoreEventController {
  private static instance: CoreEventController;

  public static getInstance() {
    if (!this.instance) {
      this.instance = new CoreEventController();
    }
    return this.instance;
  }

  async getCoreEvents(): Promise<CoreEventProps[]> {
    return CoreEventAPI.getCoreEvents();
  }

  async deleteCoreEvent({ id }: { id: string }): Promise<CoreEventProps> {
    return CoreEventAPI.deleteCoreEvent({ id });
  }
}

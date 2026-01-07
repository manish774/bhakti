export enum CoreEventIds {
  ONLINE_PUJA = "coreevent_online_puja",
  OFFLINE_PUJA = "coreevent_offline_puja",
}
export type CoreEventProps = {
  _id?: string;
  type: CoreEventIds;
  title: string;
  description?: string;
  icon: string;
  color: string;
  shadowColor: string;
  visible: boolean;
};

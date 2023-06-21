import type { Database } from "~/lib/database.types";

export type Show = Database["public"]["Tables"]["shows"]["Row"];
export type Reservation = Database["public"]["Tables"]["reservations"]["Row"];
export type ReservationWithShow = Reservation & { show: Show };
export interface StorageData {
  path: string;
}

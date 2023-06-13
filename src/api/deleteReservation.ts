import { supabaseAuthClient } from "../pages/dashboard";
// types
import type { Database } from "~/lib/database.types";

export const deleteReservation = async (reservationIDs: number[]) => {
  const { data: response, error } = await supabaseAuthClient
    .from("reservations")
    .delete()
    .in("id", reservationIDs);
  return new Promise((resolve, reject) => {
    if (response) {
      resolve(response);
    }
    if (error) {
      reject(error);
    }
  });
};

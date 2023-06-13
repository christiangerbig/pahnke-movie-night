import { supabaseAuthClient } from "../pages/dashboard";
// types
import type { Database } from "~/lib/database.types";

export const addReservation = async (
  reservation: Database["public"]["Tables"]["reservations"]["Insert"],
) => {
  const { data: newReservation, error } = await supabaseAuthClient
    .from("reservations")
    .insert(reservation)
    .select("*");
  return new Promise((resolve, reject) => {
    if (newReservation) {
      resolve(newReservation);
    }
    if (error) {
      reject(error);
    }
  });
};

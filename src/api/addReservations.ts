import { supabaseAuthClient } from "../pages/dashboard";
// types
import type { Database } from "~/lib/database.types";

export const addReservations = async (
  userReservations: Database["public"]["Tables"]["reservations"]["Insert"][],
) => {
  const { data: reservations, error } = await supabaseAuthClient
    .from("reservations")
    .insert(userReservations)
    .select("*"); // Return data after inserting

  return new Promise((resolve, reject) => {
    if (reservations) {
      resolve(reservations);
    }
    if (error) {
      reject(error);
    }
  });
};

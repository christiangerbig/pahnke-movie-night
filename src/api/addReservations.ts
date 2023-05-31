import type { Database } from "~/lib/database.types";
import { supabaseAuthClient } from "~/pages";

export const addReservations = async (
  userReservations: Database["public"]["Tables"]["reservations"]["Insert"][],
) => {
  const { data: reservations, error } = await supabaseAuthClient
    .from("reservations")
    .insert(userReservations)
    .select("*");
  return new Promise((resolve, reject) => {
    if (reservations) {
      resolve(reservations);
    }
    if (error) {
      reject(error);
    }
  });
};

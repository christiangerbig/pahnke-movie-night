import { supabaseAuthClient } from "../pages/dashboard";
// types
import type { Database } from "~/lib/database.types";

export const addReservations = async (
  userReservations: Database["public"]["Tables"]["reservations"]["Insert"][],
) => {
  const { data: response, error } = await supabaseAuthClient
    .from("reservations")
    .insert(userReservations)
    .select("*"); // Return data after inserting

  return new Promise((resolve, reject) => {
    if (response) {
      resolve(response);
    }
    if (error) {
      reject(error);
    }
  });
};

import { supabaseAuthClient } from "../pages/dashboard";
// types
import type { Database } from "~/lib/database.types";

export const addReservation = async (
  reservation: Database["public"]["Tables"]["reservations"]["Insert"],
) => {
  const { data: res, error } = await supabaseAuthClient
    .from("reservations")
    .insert(reservation)
    .select("*"); // Return data after inserting

  return new Promise((resolve, reject) => {
    if (res) {
      resolve(res);
    }
    if (error) {
      reject(error);
    }
  });
};

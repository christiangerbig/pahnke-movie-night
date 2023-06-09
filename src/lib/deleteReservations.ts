import { supabaseAuthClient } from "~/pages";
// types
import type { Database } from "~/lib/database.types";

export const addReservations = async (
  reservations: Database["public"]["Tables"]["reservations"]["Delete"][],
) => {
  const { data: result, error } = await supabaseAuthClient
    .from("reservations")
    .delete()
    .eq("id", [reservations[0].id, reservations[1].id]);
  return new Promise((resolve, reject) => {
    if (result) {
      resolve(result);
    }
    if (error) {
      reject(error);
    }
  });
};

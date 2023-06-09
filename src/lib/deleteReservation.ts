import { supabaseAuthClient } from "~/pages";
// types
import type { Database } from "~/lib/database.types";

export const deleteReservation = async ({
  id,
}: Database["public"]["Tables"]["reservations"]["Delete"]) => {
  const { data: result, error } = await supabaseAuthClient
    .from("reservations")
    .delete()
    .eq("id", id);
  return new Promise((resolve, reject) => {
    if (result) {
      resolve(result);
    }
    if (error) {
      reject(error);
    }
  });
};

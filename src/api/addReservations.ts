import type { Database } from "~/lib/database.types";
import { supabaseAuthClient } from "~/pages";

export const addReservations = async (
  userReservations: Database["public"]["Tables"]["reservations"]["Insert"][],
) => {
  const feedback = await supabaseAuthClient
    .from("reservations")
    .insert(userReservations);
  return feedback;
};

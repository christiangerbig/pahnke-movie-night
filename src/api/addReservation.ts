import type { Database } from "~/lib/database.types";
import { supabaseAuthClient } from "~/pages";

export const addReservation = async (
  reservation: Database["public"]["Tables"]["reservations"]["Insert"],
) => {
  const feedback = await supabaseAuthClient
    .from("reservations")
    .insert(reservation);
  return feedback;
};

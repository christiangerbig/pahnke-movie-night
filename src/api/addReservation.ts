import { supabaseAuthClient } from "~/pages";

export const addReservation = async (reservation: any) => {
  const feedback = await supabaseAuthClient
    .from("reservations")
    .insert(reservation);
  return feedback;
};

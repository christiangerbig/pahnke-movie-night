import { supabaseAuthClient } from "../pages/dashboard";

export const deleteReservation = async (reservationIds: number[]) => {
  const { data: response, error } = await supabaseAuthClient
    .from("reservations")
    .delete()
    .in("id", reservationIds)
    .select("*"); // Return data after deleting

  return new Promise((resolve, reject) => {
    if (response) {
      resolve(response);
    }
    if (error) {
      reject(error);
    }
  });
};

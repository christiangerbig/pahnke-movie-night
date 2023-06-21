import { supabaseAuthClient } from "../pages/dashboard";

export const deleteReservation = async (reservationIds: number[]) => {
  const { data: res, error } = await supabaseAuthClient
    .from("reservations")
    .delete()
    .in("id", reservationIds)
    .select("*"); // Return data after deleting

  return new Promise((resolve, reject) => {
    if (res) {
      resolve(res);
    }
    if (error) {
      reject(error);
    }
  });
};

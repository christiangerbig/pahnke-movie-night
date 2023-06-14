import { supabaseAuthClient } from "../pages/dashboard";

export const fetchReservations = async () => {
  const { data: reservations, error } = await supabaseAuthClient
    .from("reservations")
    .select(`*, show!inner (*)`); // Return data after fetching

  return new Promise((resolve, reject) => {
    if (reservations) {
      resolve(reservations);
    }
    if (error) {
      reject(error);
    }
  });
};

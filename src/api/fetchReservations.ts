import { supabaseAuthClient } from "../pages/dashboard";

export const fetchReservations = async () => {
  const { data: response, error } = await supabaseAuthClient
    .from("reservations")
    .select(`*, show!inner (*)`); // Return data after fetching

  return new Promise((resolve, reject) => {
    if (response) {
      resolve(response);
    }
    if (error) {
      reject(error);
    }
  });
};

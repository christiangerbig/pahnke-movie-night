import { supabaseAuthClient } from "../pages/dashboard";

export const fetchReservations = async () => {
  const { data: res, error } = await supabaseAuthClient
    .from("reservations")
    .select(`*, show!inner (*)`); // Return data after fetching

  return new Promise((resolve, reject) => {
    if (res) {
      resolve(res);
    }
    if (error) {
      reject(error);
    }
  });
};

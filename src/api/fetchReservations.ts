import { supabaseAuthClient } from "~/pages";

export const fetchReservations = async () => {
  const { data: reservations, error } = await supabaseAuthClient
    .from("reservations")
    .select(`*, show!inner (*)`);

  return new Promise((resolve, reject) => {
    if (reservations) {
      resolve(reservations);
    }
    if (error) {
      reject(error);
    }
  });
};

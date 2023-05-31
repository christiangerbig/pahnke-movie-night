import { create } from "zustand";
import type { ReservationWithShow, Show } from "~/components/ReservationForm";

interface CinemaState {
  shows: Show[];
  reservations: ReservationWithShow[];
  isDoubleBooking: boolean;
  actions: {
    setShows: (shows: Show[]) => void;
    setReservations: (reservations: ReservationWithShow[]) => void;
    setIsDoubleBooking: (isDoubleBooking: boolean) => void;
  };
}

export const useCinemaStore = create<CinemaState>((set) => ({
  shows: [],
  reservations: [],
  isDoubleBooking: false,
  actions: {
    setShows: (shows) => {
      set({ shows });
    },
    setReservations: (reservations) => {
      set({ reservations });
    },
    setIsDoubleBooking: (isDoubleBooking) => {
      set({ isDoubleBooking });
    },
  },
}));

const selectors = {
  selectShows: ({ shows }: CinemaState) => shows,
  selectReservations: ({ reservations }: CinemaState) => reservations,
  selectIsDoubleBooking: ({ isDoubleBooking }: CinemaState) => isDoubleBooking,
  selectSetShows: ({ actions: { setShows } }: CinemaState) => setShows,
  selectSetReservations: ({ actions: { setReservations } }: CinemaState) =>
    setReservations,
  selectSetIsDoubleBooking: ({
    actions: { setIsDoubleBooking },
  }: CinemaState) => setIsDoubleBooking,
};

export const {
  selectShows,
  selectReservations,
  selectIsDoubleBooking,
  selectSetShows,
  selectSetReservations,
  selectSetIsDoubleBooking,
} = selectors;

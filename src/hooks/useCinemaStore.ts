import { create } from "zustand";
import type { ReservationWithShow, Show } from "~/components/ReservationForm";

interface CinemaState {
  shows: Show[];
  reservations: ReservationWithShow[];
  isDoubleBooking: boolean;
  selectedSeats: number[];
  actions: {
    setShows: (shows: Show[]) => void;
    setReservations: (reservations: ReservationWithShow[]) => void;
    setIsDoubleBooking: (isDoubleBooking: boolean) => void;
    setSelectedSeats: (selectedSeats: number[]) => void;
  };
}

export const useCinemaStore = create<CinemaState>((set) => ({
  shows: [],
  reservations: [],
  isDoubleBooking: false,
  selectedSeats: [],
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
    setSelectedSeats: (selectedSeats) => {
      set({ selectedSeats });
    },
  },
}));

const selectors = {
  selectShows: ({ shows }: CinemaState) => shows,
  selectReservations: ({ reservations }: CinemaState) => reservations,
  selectIsDoubleBooking: ({ isDoubleBooking }: CinemaState) => isDoubleBooking,
  selectSelectedSeats: ({ selectedSeats }: CinemaState) => selectedSeats,
  selectSetShows: ({ actions: { setShows } }: CinemaState) => setShows,
  selectSetReservations: ({ actions: { setReservations } }: CinemaState) =>
    setReservations,
  selectSetIsDoubleBooking: ({
    actions: { setIsDoubleBooking },
  }: CinemaState) => setIsDoubleBooking,
  selectSetSelectedSeats: ({ actions: { setSelectedSeats } }: CinemaState) =>
    setSelectedSeats,
};

export const {
  selectShows,
  selectReservations,
  selectIsDoubleBooking,
  selectSelectedSeats,
  selectSetShows,
  selectSetReservations,
  selectSetIsDoubleBooking,
  selectSetSelectedSeats,
} = selectors;

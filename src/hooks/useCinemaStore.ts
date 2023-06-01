import { create } from "zustand";
import type { ReservationWithShow, Show } from "~/components/ReservationForm";

interface CinemaState {
  shows: Show[];
  reservations: ReservationWithShow[];
  freeSeatsSelection: number[];
  isDoubleBooking: boolean;
  selectedSeats: number[];
  actions: {
    setShows: (shows: Show[]) => void;
    setReservations: (reservations: ReservationWithShow[]) => void;
    setFreeSeatsSelection: (freeSeatsSelection: number[]) => void;
    setIsDoubleBooking: (isDoubleBooking: boolean) => void;
    setSelectedSeats: (selectedSeats: number[]) => void;
  };
}

export const useCinemaStore = create<CinemaState>((set) => ({
  shows: [],
  reservations: [],
  freeSeatsSelection: [],
  isDoubleBooking: false,
  selectedSeats: [],
  actions: {
    setShows: (shows) => {
      set({ shows });
    },
    setReservations: (reservations) => {
      set({ reservations });
    },
    setFreeSeatsSelection: (freeSeatsSelection) => {
      set({ freeSeatsSelection });
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
  selectFreeSeatsSelection: ({ freeSeatsSelection }: CinemaState) =>
    freeSeatsSelection,
  selectIsDoubleBooking: ({ isDoubleBooking }: CinemaState) => isDoubleBooking,
  selectSelectedSeats: ({ selectedSeats }: CinemaState) => selectedSeats,
  selectSetShows: ({ actions: { setShows } }: CinemaState) => setShows,
  selectSetReservations: ({ actions: { setReservations } }: CinemaState) =>
    setReservations,
  selectSetFreeSeatsSelection: ({
    actions: { setFreeSeatsSelection },
  }: CinemaState) => setFreeSeatsSelection,
  selectSetIsDoubleBooking: ({
    actions: { setIsDoubleBooking },
  }: CinemaState) => setIsDoubleBooking,
  selectSetSelectedSeats: ({ actions: { setSelectedSeats } }: CinemaState) =>
    setSelectedSeats,
};

export const {
  selectShows,
  selectReservations,
  selectFreeSeatsSelection,
  selectIsDoubleBooking,
  selectSelectedSeats,
  selectSetShows,
  selectSetReservations,
  selectSetFreeSeatsSelection,
  selectSetIsDoubleBooking,
  selectSetSelectedSeats,
} = selectors;

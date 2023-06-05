import { create } from "zustand";
import type { ReservationWithShow, Show } from "~/lib/general.types";

interface CinemaState {
  shows: Show[];
  reservations: ReservationWithShow[];
  freeSeatsSelection: number[];
  selectedSeats: number[];

  actions: {
    setShows: (shows: Show[]) => void;
    setReservations: (reservations: ReservationWithShow[]) => void;
    setFreeSeatsSelection: (freeSeatsSelection: number[]) => void;
    setSelectedSeats: (selectedSeats: number[]) => void;
    addSelectedSeat: (selectedSeat: number) => void;
    removeSelectedSeat: (selectedSeat: number) => void;
    resetSelectedSeats: () => void;
  };
}

export const useCinemaStore = create<CinemaState>((set) => ({
  shows: [],
  reservations: [],
  freeSeatsSelection: [],
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
    setSelectedSeats: (selectedSeats) => {
      set({ selectedSeats });
    },
    addSelectedSeat: (selectedSeat: number) => {
      set(({ selectedSeats }) => {
        if (selectedSeats.length < 2) {
          return { selectedSeats: [...selectedSeats, selectedSeat] };
        }

        return { selectedSeats };
      });
    },
    removeSelectedSeat: (selectedSeat: number) =>
      set(({ selectedSeats }) => ({
        selectedSeats: selectedSeats.filter((item) => item !== selectedSeat),
      })),
    resetSelectedSeats: () => set({ selectedSeats: [] }),
  },
}));

const selectors = {
  selectShows: ({ shows }: CinemaState) => shows,
  selectReservations: ({ reservations }: CinemaState) => reservations,
  selectFreeSeatsSelection: ({ freeSeatsSelection }: CinemaState) =>
    freeSeatsSelection,
  selectSelectedSeats: ({ selectedSeats }: CinemaState) => selectedSeats,
  // Actions
  selectSetShows: ({ actions: { setShows } }: CinemaState) => setShows,
  selectSetReservations: ({ actions: { setReservations } }: CinemaState) =>
    setReservations,
  selectSetFreeSeatsSelection: ({
    actions: { setFreeSeatsSelection },
  }: CinemaState) => setFreeSeatsSelection,
  selectSetSelectedSeats: ({ actions: { setSelectedSeats } }: CinemaState) =>
    setSelectedSeats,
  selectAddSelectedSeat: ({ actions: { addSelectedSeat } }: CinemaState) =>
    addSelectedSeat,
  selectRemoveSelectedSeat: ({
    actions: { removeSelectedSeat },
  }: CinemaState) => removeSelectedSeat,
  selectResetSelectedSeats: ({
    actions: { resetSelectedSeats },
  }: CinemaState) => resetSelectedSeats,
};

export const {
  selectShows,
  selectReservations,
  selectFreeSeatsSelection,
  selectSelectedSeats,
  // Actions
  selectSetShows,
  selectSetReservations,
  selectSetFreeSeatsSelection,
  selectSetSelectedSeats,
  selectAddSelectedSeat,
  selectRemoveSelectedSeat,
  selectResetSelectedSeats,
} = selectors;

import { create } from "zustand";
// types
import type { ReservationWithShow, Show } from "~/lib/general.types";

interface CinemaState {
  shows: Show[];
  reservations: ReservationWithShow[];
  freeSeats: number[];
  selectedSeats: number[];
  isGuest: boolean;

  actions: {
    setShows: (shows: Show[]) => void;
    setReservations: (reservations: ReservationWithShow[]) => void;
    setFreeSeats: (freeSeats: number[]) => void;
    setSelectedSeats: (selectedSeats: number[]) => void;
    addSelectedSeat: (selectedSeat: number) => void;
    removeSelectedSeat: (selectedSeat: number) => void;
    resetSelectedSeats: () => void;
    setIsGuest: (isGuest: boolean) => void;
  };
}

export const useCinemaStore = create<CinemaState>((set) => ({
  shows: [],
  reservations: [],
  freeSeats: [],
  selectedSeats: [],
  isGuest: false,

  actions: {
    setShows: (shows) => {
      set({ shows });
    },
    setReservations: (reservations) => {
      set({ reservations });
    },
    setFreeSeats: (freeSeats) => {
      set({ freeSeats });
    },
    setSelectedSeats: (selectedSeats) => {
      set({ selectedSeats });
    },
    addSelectedSeat: (selectedSeat: number) => {
      set(({ selectedSeats, isGuest }) => {
        if (selectedSeats.length < (isGuest ? 2 : 1)) {
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
    setIsGuest: (isGuest) => set({ isGuest }),
  },
}));

const selectors = {
  selectShows: ({ shows }: CinemaState) => shows,
  selectReservations: ({ reservations }: CinemaState) => reservations,
  selectFreeSeats: ({ freeSeats }: CinemaState) => freeSeats,
  selectSelectedSeats: ({ selectedSeats }: CinemaState) => selectedSeats,
  selectIsGuest: ({ isGuest }: CinemaState) => isGuest,
  // Actions
  selectSetShows: ({ actions: { setShows } }: CinemaState) => setShows,
  selectSetReservations: ({ actions: { setReservations } }: CinemaState) =>
    setReservations,
  selectSetFreeSeats: ({ actions: { setFreeSeats } }: CinemaState) =>
    setFreeSeats,
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
  selectSetIsGuest: ({ actions: { setIsGuest } }: CinemaState) => setIsGuest,
};

export const {
  selectShows,
  selectReservations,
  selectFreeSeats,
  selectSelectedSeats,
  selectIsGuest,
  // Actions
  selectSetShows,
  selectSetReservations,
  selectSetFreeSeats,
  selectSetSelectedSeats,
  selectAddSelectedSeat,
  selectRemoveSelectedSeat,
  selectResetSelectedSeats,
  selectSetIsGuest,
} = selectors;

import { create } from "zustand";
// types
import type { ReservationWithShow, Show } from "~/lib/general.types";
import type { Database } from "~/lib/database.types";
import type { User } from "@supabase/auth-helpers-nextjs";

interface CinemaState {
  user: User | object;
  shows: Show[];
  reservations: ReservationWithShow[];
  freeSeats: number[];
  selectedSeats: number[];
  isGuest: boolean;
  selectedShow: string | null;
  userReservations: Database["public"]["Tables"]["reservations"][];

  actions: {
    setUser: (user: User) => void;
    setShows: (shows: Show[]) => void;
    setReservations: (reservations: ReservationWithShow[]) => void;
    setFreeSeats: (freeSeats: number[]) => void;
    resetFreeSeats: () => void;
    setSelectedSeats: (selectedSeats: number[]) => void;
    addSelectedSeat: (selectedSeat: number) => void;
    removeSelectedSeat: (selectedSeat: number) => void;
    resetSelectedSeats: () => void;
    setIsGuest: (isGuest: boolean) => void;
    setSelectedShow: (selectedShow: string | null) => void;
  };
}

export const useCinemaStore = create<CinemaState>((set) => ({
  user: {},
  shows: [],
  reservations: [],
  freeSeats: [],
  selectedSeats: [],
  isGuest: false,
  selectedShow: null,
  userReservations: [],

  actions: {
    setUser: (user) => {
      set({ user });
    },
    setShows: (shows) => {
      set({ shows });
    },
    setReservations: (reservations) => {
      set({ reservations });
    },
    setFreeSeats: (freeSeats) => {
      set({ freeSeats });
    },
    resetFreeSeats: () => {
      set({ freeSeats: [] });
    },
    setSelectedSeats: (selectedSeats) => {
      set({ selectedSeats });
    },
    setSelectedShow: (selectedShow) => {
      set({ selectedShow });
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
        selectedSeats: selectedSeats.filter((seat) => seat !== selectedSeat),
      })),
    resetSelectedSeats: () => set({ selectedSeats: [] }),
    setIsGuest: (isGuest) => set({ isGuest }),
  },
}));

const selectors = {
  selectUser: ({ user }: CinemaState) => user,
  selectShows: ({ shows }: CinemaState) => shows,
  selectReservations: ({ reservations }: CinemaState) => reservations,
  selectFreeSeats: ({ freeSeats }: CinemaState) => freeSeats,
  selectSelectedSeats: ({ selectedSeats }: CinemaState) => selectedSeats,
  selectIsGuest: ({ isGuest }: CinemaState) => isGuest,
  selectUserReservations: ({ userReservations }: CinemaState) =>
    userReservations,
  // Actions
  selectSetUser: ({ actions: { setUser } }: CinemaState) => setUser,
  selectSetShows: ({ actions: { setShows } }: CinemaState) => setShows,
  selectSetReservations: ({ actions: { setReservations } }: CinemaState) =>
    setReservations,
  selectSetFreeSeats: ({ actions: { setFreeSeats } }: CinemaState) =>
    setFreeSeats,
  selectResetFreeSeats: ({ actions: { resetFreeSeats } }: CinemaState) =>
    resetFreeSeats,
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
  selectSelectedShow: ({ selectedShow }: CinemaState) => selectedShow,
  selectSetSelectedShow: ({ actions: { setSelectedShow } }: CinemaState) =>
    setSelectedShow,
};

export const {
  selectUser,
  selectShows,
  selectReservations,
  selectFreeSeats,
  selectSelectedSeats,
  selectIsGuest,
  selectUserReservations,
  // Actions
  selectSetUser,
  selectSetShows,
  selectSetReservations,
  selectSetFreeSeats,
  selectResetFreeSeats,
  selectSetSelectedSeats,
  selectAddSelectedSeat,
  selectRemoveSelectedSeat,
  selectResetSelectedSeats,
  selectSetIsGuest,
  selectSelectedShow,
  selectSetSelectedShow,
} = selectors;

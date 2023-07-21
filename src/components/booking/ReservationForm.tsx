import { useEffect, useState, useRef } from "react";
// next
import { useRouter } from "next/router";
// zustand
import {
  useCinemaStore,
  selectUser,
  selectShows,
  selectReservations,
  selectSelectedSeats,
  selectIsGuest,
  selectSetReservations,
  selectSetFreeSeats,
  selectResetFreeSeats,
  selectResetSelectedSeats,
  selectSetIsGuest,
  selectSetSelectedShow,
  selectSelectedShow,
} from "../../hooks/useCinemaStore";
// supabase
import { addReservation } from "~/api/addReservation";
import { addReservations } from "~/api/addReservations";
import { fetchReservations } from "~/api/fetchReservations";
// mantine
import { Box, Select, Button, TextInput, Checkbox, Flex } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useMediaQuery } from "@mantine/hooks";
// zod
import { z } from "zod";
// dayjs
import dayjs from "../../dayjs.config";
// locales
import translations from "../../../public/locale/translations";
// components
import ReservationDisplay from "./ReservationDisplay";
// types
import type { User } from "@supabase/supabase-js";
import type { Database } from "~/lib/database.types";
import type { ReservationWithShow, Locale } from "~/lib/general.types";

interface ShowDateEntry {
  value: string;
  label: string;
}

const ReservationForm = () => {
  const [showDates, setShowDates] = useState<ShowDateEntry[]>([]);
  const [selectedFilm, setSelectedFilm] = useState<string>("");
  const { asPath, replace, push, locale } = useRouter();
  const checkboxRef = useRef<HTMLInputElement>(null);
  // zustand
  const user = useCinemaStore(selectUser);
  const shows = useCinemaStore(selectShows);
  const reservations = useCinemaStore(selectReservations);
  const selectedSeats = useCinemaStore(selectSelectedSeats);
  const isGuest = useCinemaStore(selectIsGuest);
  const setReservations = useCinemaStore(selectSetReservations);
  const setFreeSeats = useCinemaStore(selectSetFreeSeats);
  const resetFreeSeats = useCinemaStore(selectResetFreeSeats);
  const resetSelectedSeats = useCinemaStore(selectResetSelectedSeats);
  const setIsGuest = useCinemaStore(selectSetIsGuest);
  const selectedShow = useCinemaStore(selectSelectedShow);
  const setSelectedShow = useCinemaStore(selectSetSelectedShow);
  // mantine
  const isBreakpointSM = useMediaQuery("(max-width: 48rem)");

  // Fetch component content for default language
  const {
    reservationForm: { schemaTexts, preselection, booking, button },
  } = translations[locale as Locale];

  // hook shows / selectedShow change
  useEffect(() => {
    setShowDates(
      shows.map(({ id, date, movie_title }): ShowDateEntry => {
        return {
          value: id.toString(),
          label: `${movie_title} - ${dayjs(date)
            .format("dd. DD.MM.YYYY")
            .toString()} `,
        };
      }),
    );

    resetSelectedSeats();
    selectedShow && form.setValues({ show: selectedShow });
  }, [shows, selectedShow]);

  // hook selectedShow / reservations change
  useEffect(() => {
    const reservedPlaceNumbers = reservations?.map((reservation) => {
      if (reservation.show.id === Number(selectedShow)) {
        return reservation.seat;
      }

      return null;
    });
    const freeSeats = [];
    for (let placeNumber = 1; placeNumber < 49; placeNumber++) {
      if (!reservedPlaceNumbers.includes(placeNumber)) {
        freeSeats.push(placeNumber);
      }
    }
    setFreeSeats(freeSeats);
    shows.map((show) => {
      if (show.id === Number(selectedShow)) {
        setSelectedFilm(show.movie_title);
      }
    });
  }, [selectedShow, reservations]);

  const schema = z
    .object({
      show: z
        .string()
        .trim()
        .min(1, { message: schemaTexts.show.requirements.message }),
      isGuest: z.boolean().optional(),
      guestFirstName: z
        .string()
        .min(2, { message: schemaTexts.guestFirstName.requirements.message1 })
        .or(z.literal("")),
      guestSurname: z
        .string()
        .min(2, { message: schemaTexts.guestSurname.requirements.message1 })
        .or(z.literal("")),
    })
    .superRefine(({ isGuest, guestFirstName, guestSurname }, ctx) => {
      if (isGuest && !guestFirstName) {
        ctx.addIssue({
          message: schemaTexts.guestFirstName.requirements.message2,
          code: z.ZodIssueCode.custom,
          path: ["guestFirstName"],
        });
      }

      if (isGuest && !guestSurname) {
        ctx.addIssue({
          message: schemaTexts.guestSurname.requirements.message2,
          code: z.ZodIssueCode.custom,
          path: ["guestSurname"],
        });
      }
    });

  const form = useForm({
    initialValues: {
      show: selectedShow || "",
      isGuest: false,
      guestFirstName: "",
      guestSurname: "",
    },
    validate: zodResolver(schema),
  });

  // submit
  interface HandleSubmitArgs {
    show: string;
    isGuest: boolean;
    guestFirstName: string;
    guestSurname: string;
  }

  const handleSubmit = ({
    show,
    isGuest,
    guestFirstName,
    guestSurname,
  }: HandleSubmitArgs) => {
    const resetReservationValues = () => {
      resetSelectedSeats();
      setIsGuest(false);
    };

    // booking invalid check
    if (isGuest && selectedSeats.length === 1) {
      notifications.show({
        title: booking.invalid.errorNotification.title,
        message: booking.invalid.errorNotification.message,
        color: "red",
        autoClose: 5000,
      });
      return;
    }

    form.reset();
    (checkboxRef.current as HTMLInputElement).checked = false;

    // booking doublet check
    let isDoubleBooking = false;
    reservations?.map((reservation) => {
      if (reservation.user === (user as User).id) {
        if (reservation.show.id === Number(selectedShow)) {
          isDoubleBooking = true;
        }
      }
    });
    if (isDoubleBooking) {
      resetReservationValues();
      notifications.show({
        title: booking.doublet.errorNotification.title,
        message: booking.doublet.errorNotification.message,
        color: "red",
        autoClose: 5000,
      });
      return;
    }

    // booking
    if (selectedSeats[0]) {
      const bookingCleanup = (updatedReservations: ReservationWithShow[]) => {
        setReservations(updatedReservations);
        resetReservationValues();
        resetFreeSeats();
        void replace(asPath);
        notifications.show({
          title: "",
          message:
            selectedSeats.length !== 0
              ? `${booking.correct.confirmNotification.message}`
              : `${booking.correct.confirmNotification.errorMessage}`,
          color: "green",
          autoClose: 5000,
        });
      };
      const userReservation: Database["public"]["Tables"]["reservations"]["Insert"] =
        {
          seat: selectedSeats[0],
          show: parseInt(show),
          user: (user as User).id,
        };
      // booking without guest
      if (!isGuest && !selectedSeats[1]) {
        addReservation(userReservation)
          .then(() => {
            fetchReservations()
              .then((updatedReservations): void => {
                bookingCleanup(updatedReservations as ReservationWithShow[]);
              })
              .catch((err) => {
                console.log(booking.errorMessage2, err);
              });
          })
          .catch((err) => {
            console.log(booking.errorMessage1, err);
          });
      }
      // booking with guest
      if (isGuest && selectedSeats[1]) {
        const userReservations = [];
        userReservations.push(userReservation);
        const guestReservation: Database["public"]["Tables"]["reservations"]["Insert"] =
          {
            seat: selectedSeats[1],
            show: parseInt(show),
            user: (user as User).id,
            guest_firstname: guestFirstName,
            guest_surname: guestSurname,
            is_guest: true,
          };
        userReservations.push(guestReservation);
        addReservations(userReservations)
          .then(() => {
            fetchReservations()
              .then((updatedReservations): void => {
                bookingCleanup(updatedReservations as ReservationWithShow[]);
              })
              .catch((err) => {
                console.log(booking.errorMessage2, err);
              });
          })
          .catch((err) => {
            console.log(booking.errorMessage1, err);
          });
      }
    }
  };

  return (
    <Box>
      <form
        onSubmit={form.onSubmit((values) => {
          handleSubmit(values);
        })}
      >
        <Flex direction="row" wrap="wrap" gap="lg">
          <Flex direction="column" w="100%" gap="md">
            <Select
              data={showDates}
              placeholder={preselection.selectShow.placeholder}
              w="100%"
              variant="filled"
              size="xs"
              bg="dark.9"
              {...form.getInputProps("show")}
              onChange={(value) => {
                setSelectedShow(value);
                resetSelectedSeats();
                value && form.setValues({ show: value });
                void push(`/?show=${Number(value)}`);
              }}
            />
            <Checkbox
              label={preselection.checkBoxGuest.label}
              ref={checkboxRef}
              color="indigo"
              size="xs"
              {...form.getInputProps("isGuest")}
              onChange={() => {
                form.setValues({ isGuest: !isGuest });
                setIsGuest(!isGuest);
              }}
            />
            {form.values.isGuest ? (
              <Flex direction="column" gap="md">
                <TextInput
                  label={preselection.guest.firstName.label}
                  placeholder={preselection.guest.firstName.placeholder}
                  size="xs"
                  withAsterisk
                  {...form.getInputProps("guestFirstName")}
                />
                <TextInput
                  label={preselection.guest.surname.label}
                  placeholder={preselection.guest.surname.placeholder}
                  size="xs"
                  withAsterisk
                  {...form.getInputProps("guestSurname")}
                />
              </Flex>
            ) : null}
          </Flex>
          <ReservationDisplay />
          <Flex justify="center" w="100%">
            <Button
              type="submit"
              w={isBreakpointSM ? "30%" : "100%"}
              size="xs"
              disabled={selectedSeats.length === 0}
              color="green.7"
            >
              {button.submit}
            </Button>
          </Flex>
        </Flex>
      </form>
    </Box>
  );
};

export default ReservationForm;

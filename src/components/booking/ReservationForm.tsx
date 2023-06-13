import { useEffect, useState, useRef } from "react";
// zustand
import {
  useCinemaStore,
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
// zod
import { z } from "zod";
// dayjs
import dayjs from "../../dayjs.config";
// types
import type { User } from "@supabase/supabase-js";
import type { Database } from "~/lib/database.types";
import type { ReservationWithShow } from "~/lib/general.types";
import ReservationDisplay from "./ReservationDisplay";

interface ReservationFormProps {
  user: User | object;
}

interface ShowDateEntry {
  value: string;
  label: string;
}

interface HandleSubmitArgs {
  show: string;
  isGuest: boolean;
  guestFirstName: string;
  guestSurname: string;
}

const ReservationForm = ({ user }: ReservationFormProps) => {
  const [showDates, setShowDates] = useState<ShowDateEntry[]>([]);
  // const [selectedShow, setSelectedShow] = useState<string | null>(null);
  const [selectedFilm, setSelectedFilm] = useState<string>("");
  // -> movie poster not yet supported <-
  // const [selectedShowImage, setSelectedShowImage] = useState<string | null>(null);
  const checkboxRef = useRef<HTMLInputElement>(null);
  // zustand
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

  // hook component did mount
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
  }, []);

  // hook showDates change
  // useEffect(() => {
  //   showDates[0] && setSelectedShow(showDates[0].value);
  //   form.setValues({ show: showDates[0]?.value.toString() });
  // }, [showDates]);

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
        // -> movie posters not yet supported <-
        // setSelectedShowImage(show.movie_poster);
      }
    });
  }, [selectedShow, reservations]);

  // zod schema
  const schema = z
    .object({
      show: z.string().trim().min(1, { message: "Bitte eine Show auswählen" }),
      isGuest: z.boolean().optional(),
      guestFirstName: z
        .string()
        .min(2, { message: "Mindestens 2 Zeichen" })
        .or(z.literal("")),
      guestSurname: z
        .string()
        .min(2, { message: "Mindestens 2 Zeichen" })
        .or(z.literal("")),
    })
    .superRefine(({ isGuest, guestFirstName, guestSurname }, ctx) => {
      if (isGuest && !guestFirstName) {
        ctx.addIssue({
          message: "Bitte einen Vornamen angeben",
          code: z.ZodIssueCode.custom,
          path: ["guestFirstName"],
        });
      }

      if (isGuest && !guestSurname) {
        ctx.addIssue({
          message: "Bitte einen Nachnamen angeben",
          code: z.ZodIssueCode.custom,
          path: ["guestSurname"],
        });
      }
    });

  // mantine form
  const form = useForm({
    initialValues: {
      show: "",
      isGuest: false,
      guestFirstName: "",
      guestSurname: "",
    },
    validate: zodResolver(schema),
  });

  // submit
  const handleSubmit = ({
    show,
    isGuest,
    guestFirstName,
    guestSurname,
  }: HandleSubmitArgs) => {
    const resetReservationValues = () => {
      resetSelectedSeats();
      setIsGuest(false);
      showDates[0] && setSelectedShow(showDates[0].value);
      form.setValues({
        show: showDates[0]?.value.toString(),
      });
    };

    // booking invalid check
    if (isGuest && selectedSeats.length === 1) {
      notifications.show({
        title: "Ungültige Reservierung!",
        message: "Bitte noch einen Platz für den Gast angeben.",
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
        title: "Doppelte Reservierung!",
        message: "Nur eine Buchung pro Vorstellung möglich.",
        color: "red",
        autoClose: 5000,
      });
      return;
    }

    // booking normal
    if (selectedSeats[0]) {
      const bookingCleanup = (updatedReservations: ReservationWithShow[]) => {
        setReservations(updatedReservations);
        resetReservationValues();
        notifications.show({
          title: "",
          message:
            selectedSeats[0] && !selectedSeats[1]
              ? `Platz ${selectedSeats[0].toString()} für den Film "${selectedFilm}" wurde gebucht.`
              : selectedSeats[0] && selectedSeats[1]
              ? `Plätze ${selectedSeats[0].toString()} und ${selectedSeats[1].toString()} für den Film "${selectedFilm}" wurden gebucht.`
              : "Es ist ein Fehler aufgetreten.",
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
            resetFreeSeats();
            fetchReservations()
              .then((updatedReservations): void => {
                bookingCleanup(updatedReservations as ReservationWithShow[]);
              })
              .catch((err) => {
                console.log("Fehler:", err);
              });
          })
          .catch((err) => {
            console.log("Fehler:", err);
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
            resetFreeSeats();
            fetchReservations()
              .then((updatedReservations): void => {
                bookingCleanup(updatedReservations as ReservationWithShow[]);
              })
              .catch((err) => {
                console.log("Fehler:", err);
              });
          })
          .catch((err) => {
            console.log("Fehler:", err);
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
              placeholder="Wähle eine Show aus..."
              w="100%"
              variant="filled"
              bg="dark.9"
              {...form.getInputProps("show")}
              onChange={(value) => {
                setSelectedShow(value);
                resetSelectedSeats();
                value && form.setValues({ show: value });
              }}
            />
            <Checkbox
              label="Ich möchte einen Gast mitbringen"
              ref={checkboxRef}
              color="indigo"
              {...form.getInputProps("isGuest")}
              onChange={() => {
                form.setValues({ isGuest: !isGuest });
                setIsGuest(!isGuest);
              }}
            />
            {form.values.isGuest ? (
              <Flex direction="column" gap="md">
                <TextInput
                  label="Vorname Gast"
                  placeholder="Vorname"
                  withAsterisk
                  {...form.getInputProps("guestFirstName")}
                />
                <TextInput
                  label="Nachname Gast"
                  placeholder="NachName"
                  withAsterisk
                  {...form.getInputProps("guestSurname")}
                />
              </Flex>
            ) : null}
          </Flex>
          <ReservationDisplay />
          <Button
            type="submit"
            w="100%"
            disabled={selectedSeats.length === 0}
            color="indigo"
          >
            Ticket(s) buchen
          </Button>
        </Flex>
      </form>
    </Box>
  );
};

export default ReservationForm;

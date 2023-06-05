import { useEffect, useState, useRef } from "react";
// mantine
import {
  Box,
  Select,
  Button,
  TextInput,
  Checkbox,
  Flex,
  Text,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
// zustand
import {
  useCinemaStore,
  selectShows,
  selectReservations,
  selectSelectedSeats,
  selectSetReservations,
  selectSetFreeSeatsSelection,
  selectResetSelectedSeats,
} from "../hooks/useCinemaStore";
// supabase
import type { User } from "@supabase/supabase-js";
import { addReservation } from "~/api/addReservation";
import { addReservations } from "~/api/addReservations";
import { fetchReservations } from "~/api/fetchReservations";
import type { Database } from "~/lib/database.types";
// zod
import { z } from "zod";
// types
import type { ReservationWithShow } from "~/lib/general.types";

import dayjs from "dayjs";

interface ReservationFormProps {
  user: object;
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
  const [showDatesSelection, setShowDatesSelection] = useState<ShowDateEntry[]>(
    [],
  );
  const [selectedShow, setSelectedShow] = useState<string | null>(null);
  const [isDoubleBooking, setIsDoubleBooking] = useState<boolean>(false);
  // const [selectedShowImage, setSelectedShowImage] = useState<string | null>(
  //   null,
  // );
  const checkboxRef = useRef<HTMLInputElement>(null);

  const shows = useCinemaStore(selectShows);
  const reservations = useCinemaStore(selectReservations);
  const setReservations = useCinemaStore(selectSetReservations);
  const setFreeSeatsSelection = useCinemaStore(selectSetFreeSeatsSelection);
  const selectedSeats = useCinemaStore(selectSelectedSeats);
  const resetSelectedSeates = useCinemaStore(selectResetSelectedSeats);

  // component did mount
  useEffect(() => {
    setShowDatesSelection(
      shows.map(({ id, date }): ShowDateEntry => {
        return {
          value: id.toString(),
          label: dayjs(date).format("DD. MMMM YYYY").toString(),
        };
      }),
    );
  }, []);

  // selected show/reservations change
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
    setFreeSeatsSelection(freeSeats);

    //   shows.map((show) => {
    //     if (show.id === Number(selectedShow)) {
    //       setSelectedShowImage(show.movie_poster);
    //     }
    //   });
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
    form.reset();
    (checkboxRef.current as HTMLInputElement).checked = false;
    console.log("submit:", selectedSeats);

    let isDoubleBooking = false;

    reservations?.map((reservation) => {
      if (reservation.user === (user as User).id) {
        if (reservation.show.id === Number(selectedShow)) {
          setIsDoubleBooking(true);
          isDoubleBooking = true;
        }
      }
    });

    if (isDoubleBooking) {
      console.log("DoubleBooking");
      return;
    }

    if (selectedSeats[0]) {
      const userReservation: Database["public"]["Tables"]["reservations"]["Insert"] =
        {
          seat: selectedSeats[0],
          show: parseInt(show),
          user: (user as User).id,
        };

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
            setFreeSeatsSelection([]);
            fetchReservations()
              .then((updatedReservations): void => {
                setReservations(updatedReservations as ReservationWithShow[]);
              })
              .catch((err) => {
                console.log("Fehler:", err);
              });
          })
          .catch((err) => {
            console.log("Fehler:", err);
          });
      } else {
        addReservation(userReservation)
          .then(() => {
            setFreeSeatsSelection([]);
            fetchReservations()
              .then((updatedReservations): void => {
                setReservations(updatedReservations as ReservationWithShow[]);
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
    <Box mb="4rem">
      <form
        onSubmit={form.onSubmit((values) => {
          handleSubmit(values);
        })}
      >
        <Flex
          justify="flex-start"
          align="flex-start"
          direction="row"
          wrap="wrap"
          h={"17rem"}
        >
          <Flex
            justify="flex-start"
            align="flex-start"
            direction="column"
            mr="2rem"
            w={"10rem"}
          >
            <Select
              ml={"0rem"}
              mr={"2.5rem"}
              size="xs"
              data={showDatesSelection}
              label="Show"
              placeholder="Wähle eine Show aus..."
              withAsterisk
              {...form.getInputProps("show")}
              onChange={(values) => {
                setSelectedShow(values);

                resetSelectedSeates();

                values && form.setValues({ show: values });
              }}
            />
            <Checkbox
              size="xs"
              label="Gast?"
              ref={checkboxRef}
              {...form.getInputProps("isGuest")}
              mt="2.5rem"
            />
            {form.values.isGuest ? (
              <Box mt={"1.3rem"}>
                <TextInput
                  ml={"0rem"}
                  mr={"2.5rem"}
                  size="xs"
                  label="Gast Vorname"
                  placeholder="Vorname"
                  {...form.getInputProps("guestFirstName")}
                />
                <TextInput
                  ml={"0rem"}
                  mr={"2.5rem"}
                  size="xs"
                  label="Gast Nachname"
                  placeholder="NachName"
                  {...form.getInputProps("guestSurname")}
                  mt="1.5rem"
                />
              </Box>
            ) : null}
          </Flex>
        </Flex>
        {isDoubleBooking && (
          <Text fz="lg" color="orange">
            Doppelbuchung! Es können pro Vorstellung nur einmal Plätze
            reserviert werden.
          </Text>
        )}
        <Button type="submit" mt="1.5rem" compact>
          buchen
        </Button>
      </form>
    </Box>
  );
};

export default ReservationForm;

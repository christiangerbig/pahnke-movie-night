import { useEffect, useState, useRef } from "react";
import {
  Box,
  Select,
  Button,
  TextInput,
  Checkbox,
  Container,
  Flex,
  Image,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import type { Database } from "~/lib/database.types";
import type { User } from "@supabase/supabase-js";
import { addReservation } from "~/api/addReservation";
import { z } from "zod";

export type Show = Database["public"]["Tables"]["shows"]["Row"];
export type Reservation = Database["public"]["Tables"]["reservations"]["Row"];
export type ReservationWithShow = Reservation & { show: Show };

interface ReservationFormProps {
  shows: Show[];
  reservations: ReservationWithShow[];
  user: object;
}

interface ShowDateEntry {
  value: string;
  label: string;
}

interface HandleSubmitArgs {
  show: string;
  seat: string;
  isGuest: boolean;
  guestFirstName: string;
  guestSurname: string;
}

const ReservationForm = ({
  user,
  shows,
  reservations,
}: ReservationFormProps) => {
  const [showDatesSelection, setShowDatesSelection] = useState<ShowDateEntry[]>(
    [],
  );
  const [selectedShow, setSelectedShow] = useState<string | null>(null);
  const [freeSeatsSelection, setFreeSeatsSelection] = useState<string[]>([]);
  const [selectedShowImage, setSelectedShowImage] = useState<string | null>(
    null,
  );
  const checkboxRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setShowDatesSelection(
      shows.map(({ id, date }): ShowDateEntry => {
        return {
          value: id.toString(),
          label: date.toString(),
        };
      }),
    );
  }, []);

  useEffect(() => {
    const reservedPlaceNumbers = reservations?.map((reservation) => {
      if (reservation.show.id === Number(selectedShow)) {
        return reservation.seat;
      }
      return null;
    });

    const freeSeats = [];
    for (let placeNumber = 1; placeNumber < 11; placeNumber++) {
      if (!reservedPlaceNumbers.includes(placeNumber)) {
        freeSeats.push(placeNumber.toString());
      }
    }
    setFreeSeatsSelection(freeSeats);

    shows.map((show) => {
      if (show.id === Number(selectedShow)) {
        setSelectedShowImage(show.movie_poster);
      }
    });
  }, [selectedShow]);

  const schema = z
    .object({
      show: z.string().trim().min(1, { message: "Bitte eine Show auswählen" }),
      seat: z
        .string()
        .trim()
        .min(1, { message: "Bitte einen Platz auswählen" }),
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

  const form = useForm({
    initialValues: {
      show: "",
      seat: "",
      isGuest: false,
      guestFirstName: "",
      guestSurname: "",
    },
    validate: zodResolver(schema),
  });

  const handleSubmit = ({
    show,
    seat,
    isGuest,
    guestFirstName,
    guestSurname,
  }: HandleSubmitArgs) => {
    form.reset();
    (checkboxRef.current as HTMLInputElement).checked = false;
    const newReservation: Database["public"]["Tables"]["reservations"]["Insert"] =
      {
        seat: parseInt(seat),
        show: parseInt(show),
        user: (user as User).id,
      };
    if (isGuest) {
      newReservation.guest_firstname = guestFirstName;
      newReservation.guest_surname = guestSurname;
      newReservation.is_guest = true;
    }
    addReservation(newReservation).catch((err) => {
      console.log(err);
    });
  };

  return (
    <Box mt="4rem" mb="4rem">
      <Flex justify="flex-start" align="flex-start" direction="row" wrap="wrap">
        <form
          onSubmit={form.onSubmit((values) => {
            handleSubmit(values);
          })}
        >
          <Select
            data={showDatesSelection}
            label="Show"
            placeholder="Wähle eine Show aus..."
            withAsterisk
            {...form.getInputProps("show")}
            onChange={(values) => {
              setSelectedShow(values);
              values && form.setValues({ show: values });
            }}
            maw="10rem"
          />
          <Select
            data={freeSeatsSelection}
            label="Plätze"
            placeholder="Wähle einen Platz aus..."
            withAsterisk
            {...form.getInputProps("seat")}
            mt="1.5rem"
            maw="10rem"
          />
          <Checkbox
            label="Gast?"
            ref={checkboxRef}
            {...form.getInputProps("isGuest")}
            mt="2.5rem"
          />
          {form.values.isGuest ? (
            <Container>
              <TextInput
                label="Gast Vorname"
                placeholder="Vorname"
                {...form.getInputProps("guestFirstName")}
                mt="1.5rem"
                maw="10rem"
              />
              <TextInput
                label="Gast Nachname"
                placeholder="NachName"
                {...form.getInputProps("guestSurname")}
                mt="1.5rem"
                maw="10rem"
              />{" "}
            </Container>
          ) : null}
          <Button type="submit" mt="2.5rem">
            Platz buchen
          </Button>
        </form>
        <Container maw="19.8rem">
          {selectedShowImage && (
            <Image src={selectedShowImage} alt="Movie poster" radius="sm" />
          )}
        </Container>
      </Flex>
    </Box>
  );
};

export default ReservationForm;

import { useEffect, useState } from "react";
<<<<<<< HEAD
import {
  Box,
  Select,
  Button,
  TextInput,
  Flex,
  Image,
  Container,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import type { Database } from "~/lib/database.types";
import type { User } from "@supabase/supabase-js";
import { addReservation } from "~/api/addReservation";
=======
import { Box, Select, Button, TextInput, Text, Checkbox } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import type { Database } from "~/lib/database.types";
import type { User } from "@supabase/supabase-js";
import { addReservation } from "~/api/addReservation";
import { z } from "zod";
>>>>>>> zod

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

    shows.map((element) => {
      if (element.id === Number(selectedShow)) {
        setSelectedShowImage(element.movie_poster);
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
    .superRefine((values, ctx) => {
      if (values.isGuest && !values.guestFirstName) {
        ctx.addIssue({
          message: "required",
          code: z.ZodIssueCode.custom,
          path: ["guestFirstName"],
        });
      }

      if (values.isGuest && !values.guestSurname) {
        ctx.addIssue({
          message: "required",
          code: z.ZodIssueCode.custom,
          path: ["guestSurname"],
        });
      }
    });

  const form = useForm({
    initialValues: {
      show: "",
      seat: "",
      guestFirstName: "",
      guestSurname: "",
      isGuest: false,
    },
<<<<<<< HEAD
    validate: {
      show: (value) => (value === "" ? "Bitte eine Show auswählen" : null),
      seat: (value) => (value === "" ? "Bitte einen Platz auswählen" : null),
      guestFirstName: (value, values) =>
        value && values.guestSurname === ""
          ? "Bitte zusätzlich zum Vornamen auch einen Nachnamen angeben"
          : null,
      guestSurname: (value, values) =>
        value && values.guestFirstName === ""
          ? "Bitte zusaätzlich zum Nachnamen auch einen Vornamen angeben"
          : null,
    },
=======
    validate: zodResolver(schema),
>>>>>>> zod
  });

  const handleSubmit = ({
    show,
    seat,
    guestFirstName,
    guestSurname,
  }: HandleSubmitArgs) => {
    form.reset();
    addReservation({
      guest_firstname: guestFirstName,
      guest_surname: guestSurname,
      is_guest: guestFirstName && guestSurname ? true : false,
      seat: parseInt(seat),
      show: parseInt(show),
      user: (user as User).id,
    }).catch((err) => {
      console.log(err);
    });
  };

  return (
    <Box mt="4rem" mb="4rem">
<<<<<<< HEAD
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
            maw="10rem"
            {...form.getInputProps("show")}
            onChange={(values) => {
              setSelectedShow(values);
              values && form.setValues({ show: values });
            }}
          />
          <Select
            data={freeSeatsSelection}
            label="Plätze"
            placeholder="Wähle einen Platz aus..."
            withAsterisk
            mt="1.5rem"
            maw="10rem"
            {...form.getInputProps("seat")}
          />
          <TextInput
            label="Gast Vorname"
            placeholder="Vorname"
            {...form.getInputProps("guestFirstName")}
            mt="2.5rem"
            maw="10rem"
          />
          <TextInput
            label="Gast Nachname"
            placeholder="NachName"
            {...form.getInputProps("guestSurname")}
            mt="2.5rem"
            maw="10rem"
          />
          <Button type="submit" mt="2.5rem">
            Platz buchen
          </Button>
        </form>
        <Container maw="19.8rem">
          {selectedShowImage && (
            <Image radius="sm" src={selectedShowImage} alt="Movie poster" />
          )}
        </Container>
      </Flex>
=======
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
          maw="10rem"
          {...form.getInputProps("show")}
          onChange={(values) => {
            setSelectedShow(values);
            values && form.setValues({ show: values });
          }}
        />
        <Select
          data={freeSeatsSelection}
          label="Plätze"
          placeholder="Wähle einen Platz aus..."
          withAsterisk
          mt="1.5rem"
          maw="10rem"
          {...form.getInputProps("seat")}
        />
        <Checkbox {...form.getInputProps("isGuest")} label="Gast?" />
        <TextInput
          label="Gast Vorname"
          placeholder="Vorname"
          {...form.getInputProps("guestFirstName")}
          mt="2.5rem"
          maw="10rem"
        />
        <TextInput
          label="Gast Nachname"
          placeholder="NachName"
          {...form.getInputProps("guestSurname")}
          mt="2.5rem"
          maw="10rem"
        />
        <Button type="submit" mt="2.5rem">
          Platz buchen
        </Button>
      </form>
>>>>>>> zod
    </Box>
  );
};

export default ReservationForm;

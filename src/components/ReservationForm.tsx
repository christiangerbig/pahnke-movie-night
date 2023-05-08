import { useEffect, useState } from "react";
import { Box, Select, Button, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import type { Database } from "~/lib/database.types";
import type { User } from "@supabase/supabase-js";
import { addReservation } from "~/api/addReservation";

interface ReservationFormProps {
  shows: Database["public"]["Tables"]["shows"]["Row"][];
  reservations: Database["public"]["Tables"]["reservations"]["Row"][];
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
    const reservedPlaceNumbers = reservations.map(({ show, seat }) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
      if ((show as any).id === Number(selectedShow)) {
        return seat;
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
  }, [selectedShow]);

  const form = useForm({
    initialValues: {
      show: "",
      seat: "",
      guestFirstName: "",
      guestSurname: "",
    },
    validate: {
      show: (value) => (value === "" ? "Bitte ein Show auswählen" : null),
      seat: (value) => (value === "" ? "Bitte einen Platz auswählen" : null),
    },
  });

  const handleSubmit = ({
    show,
    seat,
    guestFirstName,
    guestSurname,
  }: HandleSubmitArgs) => {
    if (guestFirstName || guestSurname) {
      if (!(guestFirstName && guestSurname)) {
        return;
      }
    }
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
    </Box>
  );
};

export default ReservationForm;

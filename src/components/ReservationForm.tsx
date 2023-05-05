import { useEffect, useState } from "react";
import { Box, Select, Button, TextInput } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { Database } from "~/lib/database.types";

interface ReservationFormProps {
  shows: Database["public"]["Tables"]["shows"]["Row"][];
  reservations: Database["public"]["Tables"]["reservations"]["Row"][];
  user: {};
}

interface ShowDateEntry {
  value: string;
  label: string;
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
      shows.map((entry) => {
        return {
          value: entry.id.toString(),
          label: entry.date,
        };
      }),
    );
  }, []);

  useEffect(() => {
    const reservedPlaceNumbers = reservations.map((reservation) => {
      if ((reservation.show as any).id.toString() === selectedShow) {
        return reservation.seat;
      }
      return null;
    });

    let freeSeats = [];
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
      show: isNotEmpty(),
      seat: isNotEmpty(),
    },
  });

  const handleSubmit = (values: any) => {
    form.reset();
    console.log("Submit", values);
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
          mb="1.5rem"
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
          mb="2.5rem"
          maw="10rem"
          {...form.getInputProps("seat")}
        />
        <TextInput
          label="Gast Vorname"
          placeholder="Vorname"
          {...form.getInputProps("guestFirstName")}
          mb="2.5rem"
          maw="10rem"
        />
        <TextInput
          label="Gast Nachname"
          placeholder="NachName"
          {...form.getInputProps("guestSurname")}
          mb="2.5rem"
          maw="10rem"
        />
        <Button type="submit">Platz buchen</Button>
      </form>
    </Box>
  );
};

export default ReservationForm;

import { useEffect, useState } from "react";
import { Box } from "@mantine/core";
import { Database } from "~/lib/database.types";
import { Select } from "@mantine/core";

interface ReservationFormProps {
  shows: Database["public"]["Tables"]["shows"]["Row"][];
  reservations: Database["public"]["Tables"]["reservations"]["Row"][];
}

interface ShowDateEntry {
  value: string;
  label: string;
}

const ReservationForm = ({ shows, reservations }: ReservationFormProps) => {
  const [showDatesSelection, setShowDatesSelection] = useState<ShowDateEntry[]>(
    [],
  );
  const [selectedShow, setSelectedShow] = useState<string | null>(null);
  const [freePlacesSelection, setFreePlacesSelection] = useState<string[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null);

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

    let freePlaces = [];
    for (let placeNumber = 1; placeNumber < 11; placeNumber++) {
      if (!reservedPlaceNumbers.includes(placeNumber)) {
        freePlaces.push(placeNumber.toString());
      }
    }
    setFreePlacesSelection(freePlaces);
  }, [selectedShow]);

  useEffect(() => {
    console.log("Selected place: ", selectedPlace);
  }, [selectedPlace]);

  return (
    <Box mt="4rem" mb="4rem">
      <Select
        data={showDatesSelection}
        label="Show"
        placeholder="Choose a show..."
        onChange={setSelectedShow}
        mb="1.5rem"
        maw="10rem"
      />

      <Select
        data={freePlacesSelection}
        label="Free Places"
        placeholder="Choose a place..."
        onChange={setSelectedPlace}
        maw="10rem"
      />
    </Box>
  );
};

export default ReservationForm;

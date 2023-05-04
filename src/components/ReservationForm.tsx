import { useEffect, useState } from "react";
import { Box } from "@mantine/core";
import { Database } from "~/lib/database.types";
import { Select } from "@mantine/core";

interface ReservationFormProps {
  shows: Database["public"]["Tables"]["shows"]["Row"][];
  reservations: Database["public"]["Tables"]["reservations"]["Row"][];
}

const ReservationForm = ({ shows, reservations }: ReservationFormProps) => {
  const [selectedShow, setSelectedShow] = useState<string | null>(null);

  const showDates = shows.map((entry) => {
    return {
      value: entry.id.toString(),
      label: entry.date,
    };
  });

  useEffect(() => {
    console.log(selectedShow);
  }, [selectedShow]);

  // reservations.show.id

  return (
    <Box>
      <Select
        data={showDates}
        label="Shows"
        placeholder="Choose a show..."
        onChange={setSelectedShow}
      />
    </Box>
  );
};

export default ReservationForm;

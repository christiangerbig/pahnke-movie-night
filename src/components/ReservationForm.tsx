import { useState } from "react";
import { Box } from "@mantine/core";
import { Database } from "~/lib/database.types";
import { Select } from "@mantine/core";

interface ReservationFormProps {
  shows: Database["public"]["Tables"]["shows"]["Row"][];
}

const ReservationForm = ({ shows }: ReservationFormProps) => {
  const [selectedShow, setSelectedShow] = useState<string | null>(null);

  const showDates = shows.map((entry) => entry.date);

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

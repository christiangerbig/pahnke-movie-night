// zustand
import {
  useCinemaStore,
  selectSelectedSeats,
} from "../../hooks/useCinemaStore";
// mantine
import { Box, Text } from "@mantine/core";

const ReservationDisplay = () => {
  const selectedSeats = useCinemaStore(selectSelectedSeats);

  return (
    <Box>
      {selectedSeats[0] && <Text>1. Platz: {selectedSeats[0]}</Text>}
      {selectedSeats[1] && (
        <Text mt="0.5rem">2. Platz: {selectedSeats[1]}</Text>
      )}
    </Box>
  );
};

export default ReservationDisplay;

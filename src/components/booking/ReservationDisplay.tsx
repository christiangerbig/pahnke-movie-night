// zustand
import {
  useCinemaStore,
  selectSelectedSeats,
} from "../../hooks/useCinemaStore";
// mantine
import { Flex, Text } from "@mantine/core";

const ReservationDisplay = () => {
  const selectedSeats = useCinemaStore(selectSelectedSeats);

  return (
    <Flex gap={8} align="center">
      <Text component="span" color="dimmed" size="sm">
        Ausgewählte Plätze:
      </Text>
      <Text weight="bold">
        {!selectedSeats[0] && "-"}
        {selectedSeats[0] && selectedSeats[0]}
        {selectedSeats[1] && `, ${selectedSeats[1]}`}
      </Text>
    </Flex>
  );
};

export default ReservationDisplay;

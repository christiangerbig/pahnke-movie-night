// next
import { useRouter } from "next/router";
// zustand
import {
  useCinemaStore,
  selectSelectedSeats,
} from "../../hooks/useCinemaStore";
// mantine
import { Flex, Text } from "@mantine/core";
// locales
import translations from "../../../public/locale/translations";
// types
import type { Locale } from "~/lib/general.types";

const ReservationDisplay = () => {
  const { locale } = useRouter();
  const selectedSeats = useCinemaStore(selectSelectedSeats);

  // Fetch component content for default language
  const {
    reservationDisplay: { text },
  } = translations[locale as Locale];

  return (
    <Flex gap={8} align="center">
      <Text component="span" color="dimmed" size="xs">
        {text}
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

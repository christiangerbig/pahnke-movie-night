import { useRouter } from "next/router";
// zustand
import {
  useCinemaStore,
  selectFreeSeats,
  selectSelectedSeats,
  selectAddSelectedSeat,
  selectRemoveSelectedSeat,
} from "../../hooks/useCinemaStore";
// mantine
import { Popover, Portal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
// locales
import translations from "../../../public/locale/translations";
// components
import PathGroup from "./PathGroup";
// types
import type { PropsWithChildren } from "react";
import type { Locale } from "~/lib/general.types";

interface SeatProps extends PropsWithChildren {
  seatNumber: number;
}

const Seat = ({ seatNumber, children }: SeatProps) => {
  const { locale } = useRouter();
  const [opened, { close, open }] = useDisclosure(false);
  const freeSeats = useCinemaStore(selectFreeSeats);
  const selectedSeats = useCinemaStore(selectSelectedSeats);
  const addSelectedSeat = useCinemaStore(selectAddSelectedSeat);
  const removeSelectedSeat = useCinemaStore(selectRemoveSelectedSeat);

  // Fetch component content for default language
  const {
    seat: { tooltip },
  } = translations[locale as Locale];

  const handleSelectSeat = () => {
    if (freeSeats.includes(seatNumber)) {
      if (selectedSeats.includes(seatNumber)) {
        removeSelectedSeat(seatNumber);
      } else {
        addSelectedSeat(seatNumber);
      }
    }
  };

  return (
    <Popover opened={opened}>
      <Popover.Target>
        <PathGroup
          onMouseEnter={open}
          onMouseLeave={close}
          onClick={handleSelectSeat}
        >
          {children}
        </PathGroup>
      </Popover.Target>
      <Portal>
        <Popover.Dropdown>
          {tooltip.text} <b>{seatNumber}</b>
        </Popover.Dropdown>
      </Portal>
    </Popover>
  );
};

export default Seat;

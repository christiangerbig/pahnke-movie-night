import { type PropsWithChildren } from "react";
// zustand
import {
  useCinemaStore,
  selectSelectedSeats,
  selectAddSelectedSeat,
  selectRemoveSelectedSeat,
} from "../../hooks/useCinemaStore";
// mantine
import { Popover, Portal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
// components
import PathGroup from "./PathGroup";

interface SeatProps extends PropsWithChildren {
  seatNumber: number;
}

const Seat: React.FC<SeatProps> = ({ seatNumber, children }) => {
  const [opened, { close, open }] = useDisclosure(false);
  const selectedSeats = useCinemaStore(selectSelectedSeats);
  const addSelectedSeat = useCinemaStore(selectAddSelectedSeat);
  const removeSelectedSeat = useCinemaStore(selectRemoveSelectedSeat);

  const handleClick = () => {
    if (selectedSeats.includes(seatNumber)) {
      removeSelectedSeat(seatNumber);
    } else {
      addSelectedSeat(seatNumber);
    }
  };

  return (
    <Popover opened={opened}>
      <Popover.Target>
        <PathGroup
          onClick={handleClick}
          onMouseEnter={open}
          onMouseLeave={close}
        >
          {children}
        </PathGroup>
      </Popover.Target>
      <Portal>
        <Popover.Dropdown>
          Platznummer: <b>{seatNumber}</b>
        </Popover.Dropdown>
      </Portal>
    </Popover>
  );
};

export default Seat;

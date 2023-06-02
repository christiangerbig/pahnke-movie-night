import { type PropsWithChildren } from "react";
// zustand
import {
  useCinemaStore,
  selectSelectedSeats,
  selectSetSelectedSeats,
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
  const setSelectedSeats = useCinemaStore(selectSetSelectedSeats);

  const handleClick = (
    event: { target: { toggleAttribute: (arg0: string) => void } },
    seatNumber: number,
  ) => {
    if (!event.target.hasAttribute("aria-disabled")) {
      console.log("Hallo");
      const clonedSelectedSeats = [...selectedSeats];
      const index = clonedSelectedSeats.indexOf(seatNumber);
      if (index === -1) {
        clonedSelectedSeats.push(seatNumber);
        setSelectedSeats(clonedSelectedSeats);
      } else {
        clonedSelectedSeats.splice(index, 1);
        setSelectedSeats(clonedSelectedSeats);
        event.target.toggleAttribute("data-selected");
      }
      if (selectedSeats.length < 2) {
        event.target.toggleAttribute("data-selected");
      }
    }
  };

  return (
    <Popover opened={opened}>
      <Popover.Target>
        <PathGroup
          onClick={(event): void => {
            handleClick(event, seatNumber);
          }}
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

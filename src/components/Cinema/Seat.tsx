import { useEffect, useState, type PropsWithChildren } from "react";
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
  const [isSeatSelected, setIsSeatSelected] = useState<boolean>(false);
  const [opened, { close, open }] = useDisclosure(false);
  const selectedSeats = useCinemaStore(selectSelectedSeats);
  const setSelectedSeats = useCinemaStore(selectSetSelectedSeats);

  // useEffect(() => {
  //   setSelectedSeats([]);
  // }, []);

  useEffect(() => {
    console.log(selectedSeats);
    const clonedSelectedSeats = [...selectedSeats];
    const index = clonedSelectedSeats.indexOf(seatNumber);
    if (index === -1) {
      clonedSelectedSeats.push(seatNumber);
      setSelectedSeats(clonedSelectedSeats);
    } else {
      clonedSelectedSeats.splice(index, 1);
      setSelectedSeats(clonedSelectedSeats);
    }
  }, [isSeatSelected]);

  const handleClick = ({ target }: any) => {
    if (!target.hasAttribute("aria-disabled")) {
      setIsSeatSelected(!isSeatSelected);
      target.toggleAttribute("data-selected");
    }
  };

  return (
    <Popover opened={opened}>
      <Popover.Target>
        <PathGroup
          onClick={(event): void => {
            handleClick(event);
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

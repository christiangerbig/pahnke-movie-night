import { useEffect } from "react";
// zustand
import {
  useCinemaStore,
  selectFreeSeats,
  selectSelectedSeats,
} from "../../hooks/useCinemaStore";
// data
import { seatsData } from "../../lib/seatsData";
// components
import Seat from "./Seat";

const Seats = () => {
  const freeSeats = useCinemaStore(selectFreeSeats);
  const selectedSeats = useCinemaStore(selectSelectedSeats);

  useEffect(() => {
    for (let i = 1; i < 49; i++) {
      const selectorString = `[data-seat='${i}']`;
      const element = document.querySelector(selectorString);
      element?.setAttribute("aria-disabled", "");
    }

    freeSeats.map((entry) => {
      const selectorString = `[data-seat='${entry}']`;
      const element = document.querySelector(selectorString);
      element?.toggleAttribute("aria-disabled");
    });
  }, [freeSeats]);

  return (
    <g id="seats">
      {seatsData.map((seatData, index) => {
        const seatNumber = index + 1;
        return (
          <Seat seatNumber={seatNumber} key={index.toString()}>
            <path
              data-seat={seatNumber}
              d={seatData}
              {...(selectedSeats.includes(seatNumber) && {
                "data-selected": true,
              })}
            />
          </Seat>
        );
      })}
    </g>
  );
};

export default Seats;

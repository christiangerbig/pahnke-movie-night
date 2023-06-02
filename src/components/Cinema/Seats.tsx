import { useEffect, useRef } from "react";
// hooks
import {
  useCinemaStore,
  selectFreeSeatsSelection,
  selectSelectedSeats,
} from "../../hooks/useCinemaStore";
// data
import { seatsData } from "../../lib/seatsData";
// components
import Seat from "./Seat";

const Seats = () => {
  const freeSeatsSelection = useCinemaStore(selectFreeSeatsSelection);
  const selectedSeats = useCinemaStore(selectSelectedSeats);

  useEffect(() => {
    for (let i = 1; i < 49; i++) {
      const selectorString = `[data-seat='${i}']`;
      const element = document.querySelector(selectorString);
      element?.setAttribute("aria-disabled", "");
    }

    freeSeatsSelection.map((entry) => {
      const selectorString = `[data-seat='${entry}']`;
      const element = document.querySelector(selectorString);
      element?.toggleAttribute("aria-disabled");
    });
  }, [freeSeatsSelection]);

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

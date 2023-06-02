import { useEffect } from "react";
// hooks
import {
  useCinemaStore,
  selectFreeSeatsSelection,
} from "../../hooks/useCinemaStore";
// data
import { seatsData } from "../../lib/seatsData";
// components
import Seat from "./Seat";

const Seats = () => {
  const freeSeatsSelection = useCinemaStore(selectFreeSeatsSelection);

  useEffect(() => {
    for (let i = 1; i < 49; i++) {
      const selectorString = `[data-seat='${i}']`;
      let element = document.querySelector(selectorString);
      element.setAttribute("aria-disabled", "");
      element.removeAttribute("data-selected");
    }

    freeSeatsSelection.map((entry) => {
      const selectorString = `[data-seat='${entry}']`;
      let element = document.querySelector(selectorString);
      element.toggleAttribute("aria-disabled");
    });
  }, [freeSeatsSelection]);

  return (
    <g id="seats">
      {seatsData.map((seatData, index) => {
        return (
          <Seat seatNumber={index + 1} key={index.toString()}>
            <path data-seat={index + 1} d={seatData} />
          </Seat>
        );
      })}
    </g>
  );
};

export default Seats;

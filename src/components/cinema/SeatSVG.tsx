// react
import { useEffect, useState } from "react";
// mantine
import { Flex } from "@mantine/core";
// zustand
import {
  selectSelectedShow,
  selectShows,
  useCinemaStore,
} from "~/hooks/useCinemaStore";
// components
import Defs from "./Defs";
import Seats from "./Seats";
import MovieScreen from "./MovieScreen";
import CurtainLeft from "./CurtainLeft";
import CurtainRight from "./CurtainRight";
// types
import type { Show } from "~/lib/general.types";

const SeatSVG = () => {
  const [show, setShow] = useState<Show>();
  // zustand
  const selectedShowId = useCinemaStore(selectSelectedShow);
  const shows = useCinemaStore(selectShows);

  // hook selectedShowId change
  useEffect(() => {
    setShow(
      shows.filter((show: Show) => show.id === Number(selectedShowId))[0],
    );
  }, [selectedShowId]);

  return (
    <Flex justify="center" sx={{ overflow: "hidden" }} h="100%">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xlinkHref="http://www.w3.org/1999/xlink"
        viewBox="0 0 771.67 724.2"
        height="100%"
      >
        <Defs />
        <Seats />
        <MovieScreen />
        <foreignObject
          width="480"
          height="270"
          mask="url(#screen)"
          transform="translate(149,130)"
        >
          {show && (
            <iframe
              width="100%"
              height="100%"
              src={show.movie_description as string}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            ></iframe>
          )}
        </foreignObject>
        <CurtainLeft />
        <CurtainRight />
        <path
          d="M484.03 147.55h434.83v139.74H484.03z"
          transform="rotate(90 701.445 217.415)"
          fill="url(#ac)"
        />
        <path
          d="M-147.55 147.55h434.83v139.74h-434.83z"
          transform="rotate(90 69.865 217.415)"
          fill="url(#ad)"
        />
        <path d="M0 0h771.67v143.03H0z" fill="url(#d)" />
        <mask id="screen">
          <path
            fill="#fff"
            d="M156.95 136.34h464v261H156.95z"
            transform="translate(-149,-130)"
          />
        </mask>
      </svg>
    </Flex>
  );
};

export default SeatSVG;

// mantine
import { Flex } from "@mantine/core";
// components
import Defs from "./Defs";
import Seats from "./Seats";
import MovieScreen from "./MovieScreen";
import CurtainLeft from "./CurtainLeft";
import CurtainRight from "./CurtainRight";

const SeatSVG = () => {
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
          width="500"
          height="260"
          mask="url(#screen)"
          transform="translate(142,115)"
        >
          <iframe
            width="100%"
            height="100%"
            src="https://www.youtube-nocookie.com/embed/wxN1T1uxQ2g?controls=1&autoplay=1&mute=1&loop=1&playlist=wxN1T1uxQ2g"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          ></iframe>
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
            d="M156.95 136.34h463.98v219.01H156.95z"
            transform="translate(-142,-115)"
          />
        </mask>
      </svg>
    </Flex>
  );
};

export default SeatSVG;

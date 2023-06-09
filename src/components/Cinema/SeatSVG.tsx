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
        <CurtainLeft />
        <CurtainRight />
      </svg>
    </Flex>
  );
};

export default SeatSVG;

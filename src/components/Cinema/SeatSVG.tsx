// mantine
import { Box } from "@mantine/core";
// components
import Defs from "./Defs";
import Seats from "./Seats";
import MovieScreen from "./MovieScreen";
import CurtainLeft from "./CurtainLeft";
import CurtainRight from "./CurtainRight";

const SeatSVG = () => {
  return (
    <Box sx={{ overflow: "hidden" }} w="60rem">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xlinkHref="http://www.w3.org/1999/xlink"
        viewBox="0 0 771.67 724.2"
      >
        <Defs />
        <Seats />
        <MovieScreen />
        <CurtainLeft />
        <CurtainRight />
      </svg>
    </Box>
  );
};

export default SeatSVG;

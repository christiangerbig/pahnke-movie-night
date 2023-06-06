// mantine
import { Box } from "@mantine/core";
// components
import Defs from "./Defs";
import Seats from "./Seats";
import LeftCurtain from "./LeftCurtain";
import RightCurtain from "./RightCurtain";
import Screen from "./Screen";

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
        <Screen />
        <LeftCurtain />
        <RightCurtain />
      </svg>
    </Box>
  );
};

export default SeatSVG;

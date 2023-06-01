import { Box, type BoxProps, Popover, Portal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { motion } from "framer-motion";
import { type PropsWithChildren, forwardRef, useEffect } from "react";

import { seatsData } from "../lib/seatsData";

import {
  useCinemaStore,
  selectSelectedSeats,
  selectSetSelectedSeats,
} from "../hooks/useCinemaStore";

const Defs = () => {
  return (
    <defs>
      <linearGradient
        id="seats-gradient"
        x1="0.5"
        x2="0.5"
        y2="0.623"
        gradientUnits="objectBoundingBox"
      >
        <stop offset="0" stopColor="red" />
        <stop offset="0.424" stopColor="#540000" />
        <stop offset="1" stopColor="#060606" />
      </linearGradient>
      <linearGradient
        id="seats-gradient-hover"
        x1="0.5"
        x2="0.5"
        y2="0.623"
        gradientUnits="objectBoundingBox"
      >
        <stop offset="0" stopColor="#FF8400" />
        <stop offset="0.424" stopColor="#421400" />
        <stop offset="1" stopColor="#060606" />
      </linearGradient>
      <linearGradient
        id="seats-gradient-disabled"
        x1="0.5"
        x2="0.5"
        y2="0.623"
        gradientUnits="objectBoundingBox"
      >
        <stop offset="0" stopColor="#9E9E9E" />
        <stop offset="0.424" stopColor="#292929" />
        <stop offset="1" stopColor="#060606" />
      </linearGradient>
      <linearGradient
        id="a"
        x1="707.28"
        x2="683.65"
        y1="435.78"
        y2="279.3"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stopColor="#fff" stopOpacity="0" />
        <stop offset="1" stopColor="#fff" />
      </linearGradient>
      <linearGradient
        xlinkHref="#a"
        id="e"
        x1="80.65"
        x2="112.98"
        y1="430.98"
        y2="259.24"
      />
      <linearGradient
        id="c"
        x1="388.94"
        x2="388.94"
        y1="111.89"
        y2="174.47"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stopColor="#fff" stopOpacity="0" />
        <stop offset="1" stopColor="#fff" />
      </linearGradient>
      <linearGradient
        xlinkHref="#c"
        id="Z"
        x1="388.94"
        x2="388.94"
        y1="-5260.3"
        y2="-5222.97"
        gradientTransform="matrix(1 0 0 -1 0 -4890.51)"
      />
      <linearGradient
        id="aa"
        x1="352.62"
        x2="601.5"
        y1="227.54"
        y2="226.51"
        gradientTransform="rotate(-.79 -1381.905 -2595.897)"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stopColor="#a30000" />
        <stop offset=".05" stopColor="#a10000" />
        <stop offset=".12" stopColor="#570000" />
        <stop offset=".22" stopColor="#940000" />
        <stop offset=".22" stopColor="#930000" />
        <stop offset=".27" stopColor="#6a0000" />
        <stop offset=".32" stopColor="#4d0000" />
        <stop offset=".36" stopColor="#3b0000" />
        <stop offset=".39" stopColor="#350000" />
        <stop offset=".52" stopColor="#4f0000" />
        <stop offset=".63" stopColor="#350000" />
        <stop offset=".73" stopColor="#3d0000" />
        <stop offset=".77" stopColor="#310000" />
        <stop offset=".85" stopColor="#100" />
        <stop offset=".88" stopColor="#060606" />
      </linearGradient>
      <linearGradient
        id="ab"
        x1="-3777.74"
        x2="-3506.87"
        y1="199.4"
        y2="198.27"
        gradientTransform="matrix(-1 0 0 1 -3397.14 0)"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stopColor="#850000" />
        <stop offset=".05" stopColor="#bc0000" />
        <stop offset=".11" stopColor="#540000" />
        <stop offset=".23" stopColor="#940000" />
        <stop offset=".23" stopColor="#930000" />
        <stop offset=".28" stopColor="#6a0000" />
        <stop offset=".32" stopColor="#4d0000" />
        <stop offset=".36" stopColor="#3b0000" />
        <stop offset=".39" stopColor="#350000" />
        <stop offset=".52" stopColor="#4f0000" />
        <stop offset=".63" stopColor="#350000" />
        <stop offset=".73" stopColor="#4f0000" />
        <stop offset=".76" stopColor="#430000" />
        <stop offset=".82" stopColor="#230000" />
        <stop offset=".88" stopColor="#060606" />
      </linearGradient>
      <linearGradient
        id="d"
        x1="385.84"
        x2="385.84"
        y1="115.43"
        y2="8.58"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0" stopOpacity="0" />
        <stop offset="1" />
      </linearGradient>
      <linearGradient
        xlinkHref="#d"
        id="ac"
        x1="2272.53"
        x2="2272.53"
        y1="-3457.17"
        y2="-3561.56"
        gradientTransform="translate(-1571.08 3717.49)"
      />
      <linearGradient
        xlinkHref="#d"
        id="ad"
        x1="2272.53"
        x2="2272.53"
        y1="-922.65"
        y2="-1027.04"
        gradientTransform="matrix(1 0 0 -1 -2202.66 -748.14)"
      />
    </defs>
  );
};

const PathGroup = forwardRef<
  SVGGElement,
  {
    onClick: (event: any) => void;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
  } & BoxProps
>(({ children, ...rest }, ref) => {
  return (
    <Box<"g"> component="g" ref={ref} {...rest}>
      {children}
    </Box>
  );
});

PathGroup.displayName = "PathGroup";

interface SeatProps extends PropsWithChildren {
  seatNumber: number;
}

const Seat: React.FC<SeatProps> = ({ seatNumber, children }) => {
  const [opened, { close, open }] = useDisclosure(false);
  const selectedSeats = useCinemaStore(selectSelectedSeats);
  const setSelectedSeats = useCinemaStore(selectSetSelectedSeats);

  // useEffect(() => {
  //   console.log(selectedSeats);
  // }, [selectedSeats]);

  const handleClick = (
    event: { target: { toggleAttribute: (arg0: string) => void } },
    seatNumber: number,
  ) => {
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

const Seats = () => {
  return (
    <g id="seats">
      {seatsData.map((seatData, index) => {
        return (
          <Seat seatNumber={index + 1} key={index.toString()}>
            <path aria-disabled="false" data-seat={index + 1} d={seatData} />
          </Seat>
        );
      })}
    </g>
  );
};

const RightCurtain = () => {
  return (
    <motion.path
      fill="url(#aa)"
      initial={{ x: "0%" }}
      animate={{ x: "30%" }}
      transition={{
        duration: 1,
        delay: 0.3,
        type: "tween",
      }}
      d="M381.93 2.55s4.31 162.37.9 229.27c-2.6 51.03 4.05 168.35 4.05 168.35s14.94 6 33.5 2.97c31.34-11.87 13.16 5.09 42.84-6.64 18.56-7.33 32.09 5.74 53.31 4.55 19.67-1.1 25.99-13.02 43.75-9.12 43.58 9.57 91.74-4.94 91.74-4.94L646.9 2.55H381.92Z"
    />
  );
};

const LeftCurtain = () => {
  return (
    <motion.path
      fill="url(#ab)"
      initial={{ x: "0%" }}
      animate={{ x: "-29%" }}
      transition={{
        duration: 1,
        delay: 0.3,
        type: "tween",
      }}
      d="M384.78 0s-.1 153 5.47 218.7c4.23 49.85-3.07 174.81-3.07 174.81s-25.53 6.71-43.42 4.85c-30.46-9.78-32.54 5.74-61.48-3.98-18.21-6.12-25.67 2.98-46.6 3.07-19.49.09-25.9-11.32-43.56-6.41-43.64 12.14-92.76.56-92.76.56V0h285.42Z"
    />
  );
};

const Screen = () => {
  return (
    <>
      <path fill="#fff" d="M156.95 136.34h463.98v219.01H156.95z" />
      <path fill="url(#c)" d="M156.95 96.63h463.98v40.06H156.95z" />
      <path fill="url(#Z)" d="M156.95 355h463.98v23.89H156.95z" />
      <path
        fill="url(#a)"
        d="M664.12 445.27c85.78 79.78 167.31 161.83 244.52 245.79a4444.738 4444.738 0 0 0-186.09 35.77C667.23 630.52 608.14 535.2 545.29 441.1c39.62.91 79.23 2.3 118.83 4.17Z"
      />
      <path
        fill="url(#e)"
        d="M122.48 439.42C39.67 519.2-39.04 601.08-113.57 684.75c32.02 15.98 63.69 32.29 95.01 48.92 76.26-101.4 157.88-200.92 244.78-298.13-34.59.93-69.17 2.22-103.74 3.88Z"
      />
    </>
  );
};

const SeatSVG = () => {
  return (
    <Box sx={{ overflow: "hidden" }}>
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

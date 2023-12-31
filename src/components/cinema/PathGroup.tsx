import { forwardRef } from "react";
// mantine
import { Box } from "@mantine/core";
// types
import type { BoxProps } from "@mantine/core";

const PathGroup = forwardRef<
  SVGGElement,
  {
    onClick: () => void;
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

export default PathGroup;

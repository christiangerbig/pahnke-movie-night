import { Box, Container, Flex } from "@mantine/core";
import { PushhLogo } from "./PushhLogo";
import { Facebook, Instagram } from "lucide-react";

export const Footer = () => {
  return (
    <Box h="100%" px={24}>
      <Flex align="center" h="100%" justify="space-between" gap={24}>
        <Box maw={120}>
          <a href="https://pushh.it/" target="_blank">
            <PushhLogo />
          </a>
        </Box>
        <Flex gap={24}>
          <a href="#0" target="_blank">
            <Facebook href="#0" target="_blank" />
          </a>
          <a href="#0" target="_blank">
            <Instagram />
          </a>
        </Flex>
      </Flex>
    </Box>
  );
};

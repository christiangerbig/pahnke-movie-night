// mantine
import { Box, ColorSwatch, Container, Flex, Text } from "@mantine/core";
// zustand
import {
  useCinemaStore,
  selectUser,
  selectSetReservations,
} from "../hooks/useCinemaStore";
// dayjs
import dayjs from "../dayjs.config";
// components
import SeatSVG from "~/components/cinema/SeatSVG";
// import ReservationOverview from "~/components/booking/ReservationOverview";
import { Layout } from "~/components/Layout";
// types
import type { Database } from "~/lib/database.types";
import type { ReservationWithShow } from "~/lib/general.types";
import { PushhLogo } from "~/components/PushhLogo";

import type { User } from "@supabase/auth-helpers-nextjs";

const HomePage = () => {
  const user = useCinemaStore(selectUser);

  return (
    <Layout user={user}>
      <Box component="main">
        <Box h="calc(100vh - 120px)" sx={{ overflow: "hidden" }} mx="auto">
          <SeatSVG />
        </Box>
        <Container>
          <Flex justify="space-between">
            <Flex gap="xl" align="center">
              <Flex align="center" gap="sm">
                <ColorSwatch color="red" size={20} />
                <Text component="span" size="sm">
                  Freie Plätze
                </Text>
              </Flex>
              <Flex align="center" gap="sm">
                <ColorSwatch color="orange" size={20} />
                <Text component="span" size="sm">
                  Ausgewählte Plätze
                </Text>
              </Flex>
              <Flex align="center" gap="sm">
                <ColorSwatch color="grey" size={20} />
                <Text component="span" size="sm">
                  Belegte Plätze
                </Text>
              </Flex>
            </Flex>
            <Flex px="md" align="center" gap="sm">
              <Text color="dimmed" size="xs" mb={2}>
                Powered by
              </Text>
              <Box h={40} opacity={0.5}>
                <PushhLogo />
              </Box>
            </Flex>
          </Flex>
        </Container>
      </Box>
    </Layout>
  );
};

export default HomePage;

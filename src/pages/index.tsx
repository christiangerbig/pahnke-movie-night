// supabase
import {
  createServerSupabaseClient,
  createBrowserSupabaseClient,
  type User,
} from "@supabase/auth-helpers-nextjs";
// mantine
import { Box, ColorSwatch, Container, Flex, Text } from "@mantine/core";
// zustand
import {
  useCinemaStore,
  selectSetShows,
  selectSetReservations,
} from "../hooks/useCinemaStore";
// dayjs
import dayjs from "../dayjs.config";
// components
import SeatSVG from "~/components/cinema/SeatSVG";
// import ReservationOverview from "~/components/booking/ReservationOverview";
import { Layout } from "~/components/Layout";
// types
import type { GetServerSideProps, NextPage } from "next";
import type { Database } from "~/lib/database.types";
import type { ReservationWithShow } from "~/lib/general.types";
import { PushhLogo } from "~/components/PushhLogo";

export const supabaseAuthClient = createBrowserSupabaseClient<Database>();

interface PropTypes {
  user: User;
  shows: Database["public"]["Tables"]["shows"]["Row"][];
  reservations: ReservationWithShow[];
}

const HomePage: NextPage<PropTypes> = ({ user, shows, reservations }) => {
  const setShows = useCinemaStore(selectSetShows);
  const setReservations = useCinemaStore(selectSetReservations);

  setShows(shows);
  setReservations(reservations);

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
        {/*   <ReservationOverview user={user} /> */}
      </Box>
    </Layout>
  );
};

export default HomePage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  // Create authenticated Supabase Client
  const supabaseAuthServer = createServerSupabaseClient<Database>(ctx);
  // Check if we have a session
  const {
    data: { session },
  } = await supabaseAuthServer.auth.getSession();

  if (!session)
    return {
      props: {},
    };

  const { data: reservations } = await supabaseAuthServer
    .from("reservations")
    .select(`*, show!inner (*)`);

  const { data: shows } = await supabaseAuthServer
    .from("shows")
    .select()
    .gte("date", dayjs(new Date()).format("YYYY-MM-DD"))
    .order("date", { ascending: true });

  return {
    props: {
      initialSession: session,
      user: session.user,
      shows,
      reservations,
    },
  };
};

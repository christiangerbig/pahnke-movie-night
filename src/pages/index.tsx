import { useEffect } from "react";
import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import {
  createServerSupabaseClient,
  type User,
} from "@supabase/auth-helpers-nextjs";
import dayjs from "dayjs";
// mantine
import { Box, ColorSwatch, Container, Flex, Text } from "@mantine/core";
// zustand
import {
  useCinemaStore,
  selectSetShows,
  selectSetReservations,
  selectSetUser,
  selectSetSelectedShow,
} from "../hooks/useCinemaStore";
// components
import SeatSVG from "~/components/cinema/SeatSVG";
import PushhLogo from "~/components/PushhLogo";
import Layout from "~/components/Layout";
import type { Database } from "~/lib/database.types";
import type { ReservationWithShow } from "~/lib/general.types";

interface PropTypes {
  user: User;
  shows: Database["public"]["Tables"]["shows"]["Row"][];
  reservations: ReservationWithShow[];
}

const HomePage: NextPage<PropTypes> = ({ user, shows, reservations }) => {
  const router = useRouter();
  // zustand
  const setUser = useCinemaStore(selectSetUser);
  const setShows = useCinemaStore(selectSetShows);
  const setReservations = useCinemaStore(selectSetReservations);
  const setSelectedShow = useCinemaStore(selectSetSelectedShow);

  // component did mount
  useEffect(() => {
    setUser(user);
    setShows(shows);
    setReservations(reservations);

    if (!router.query.show) {
      setSelectedShow(shows[0]?.id.toString() as string | null);
    } else {
      setSelectedShow(router.query.show as string);
    }
  }, [user]);

  console.log(shows);

  return (
    <Layout>
      <Box component="main">
        <Box h="calc(100vh - 120px)" sx={{ overflow: "hidden" }} mx="auto">
          <SeatSVG />
        </Box>
        <Container>
          <Flex justify="space-between">
            <Flex gap="xl" align="center">
              <Flex align="center" gap="sm">
                <ColorSwatch color="red" size={20} />
                <Text component="span" size="xs">
                  Freie Plätze
                </Text>
              </Flex>
              <Flex align="center" gap="sm">
                <ColorSwatch color="orange" size={20} />
                <Text component="span" size="xs">
                  Ausgewählte Plätze
                </Text>
              </Flex>
              <Flex align="center" gap="sm">
                <ColorSwatch color="grey" size={20} />
                <Text component="span" size="xs">
                  Belegte Plätze
                </Text>
              </Flex>
            </Flex>
            <Flex px="md" align="center" gap="xs">
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

export default HomePage;

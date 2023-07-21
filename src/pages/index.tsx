import { useEffect } from "react";
// next
import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import Head from "next/head";
import {
  createServerSupabaseClient,
  type User,
} from "@supabase/auth-helpers-nextjs";
// mantine
import { Box, ColorSwatch, Container, Flex, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
// zustand
import {
  useCinemaStore,
  selectSetShows,
  selectSetReservations,
  selectSetUser,
  selectSetSelectedShow,
} from "../hooks/useCinemaStore";
// dayjs
import dayjs from "dayjs";
// locales
import translations from "../../public/locale/translations";
// components
import SeatSVG from "~/components/cinema/SeatSVG";
import LogoPush from "~/components/LogoPushh";
import Layout from "~/components/Layout";
// types
import type { Database } from "~/lib/database.types";
import type { ReservationWithShow, Locale } from "~/lib/general.types";

interface HomePageProps {
  user: User;
  shows: Database["public"]["Tables"]["shows"]["Row"][];
  reservations: ReservationWithShow[];
}

const HomePage: NextPage<HomePageProps> = ({ user, shows, reservations }) => {
  const { query, locale } = useRouter();
  // Fetch component content for default language
  const { homePage } = translations[locale as Locale];
  // zustand
  const setUser = useCinemaStore(selectSetUser);
  const setShows = useCinemaStore(selectSetShows);
  const setReservations = useCinemaStore(selectSetReservations);
  const setSelectedShow = useCinemaStore(selectSetSelectedShow);
  // mantine
  const isBreakpointSM = useMediaQuery("(max-width: 48rem)");

  // hook component did mount
  useEffect(() => {
    setUser(user);
    setShows(shows);
    setReservations(reservations);

    if (!query.show) {
      setSelectedShow(shows[0]?.id.toString() as string | null);
    } else {
      setSelectedShow(query.show as string);
    }
  }, []);

  return (
    <>
      <Head>
        <title>{homePage.title}</title>
      </Head>
      <Flex
        justify="center"
        direction={isBreakpointSM ? "column" : "row"}
        wrap={isBreakpointSM ? "wrap" : undefined}
      >
        <Layout />
        <Box component="main">
          <Box
            h="calc(100vh - 7.5rem)"
            sx={{ overflow: "hidden" }}
            mx="auto"
            mt={isBreakpointSM ? "0" : "4rem"}
          >
            <SeatSVG />
          </Box>
          <Container>
            <Flex justify="space-between">
              <Flex gap="xl" align="center">
                <Flex align="center" gap="sm">
                  <ColorSwatch color="red" size="1.25rem" />
                  <Text component="span" size="xs">
                    {homePage.legend.freeSeats}
                  </Text>
                </Flex>
                <Flex align="center" gap="sm">
                  <ColorSwatch color="orange" size="1.25rem" />
                  <Text component="span" size="xs">
                    {homePage.legend.selectedSeats}
                  </Text>
                </Flex>
                <Flex align="center" gap="sm">
                  <ColorSwatch color="grey" size="1.25rem" />
                  <Text component="span" size="xs">
                    {homePage.legend.occupiedSeats}
                  </Text>
                </Flex>
              </Flex>
              <Flex px="md" align="center" gap="xs">
                <Text color="dimmed" size="xs" mb="0.125rem">
                  {homePage.logo.title}
                </Text>
                <Box h="2.5rem" opacity={0.5}>
                  <LogoPush />
                </Box>
              </Flex>
            </Flex>
          </Container>
        </Box>
      </Flex>
    </>
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

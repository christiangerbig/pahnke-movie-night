import { useEffect } from "react";
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
  selectSetUser,
} from "../hooks/useCinemaStore";
// dayjs
import dayjs from "../dayjs.config";
// components
import { PushhLogo } from "~/components/PushhLogo";
import ReservationOverview from "~/components/booking/ReservationOverview";
// types
import type { GetServerSideProps, NextPage } from "next";
import type { Database } from "~/lib/database.types";
import type { ReservationWithShow } from "~/lib/general.types";

export const supabaseAuthClient = createBrowserSupabaseClient<Database>();

interface PropTypes {
  user: User;
  shows: Database["public"]["Tables"]["shows"]["Row"][];
  reservations: ReservationWithShow[];
}

const DashboardPage: NextPage<PropTypes> = ({ user, shows, reservations }) => {
  const setUser = useCinemaStore(selectSetUser);
  const setShows = useCinemaStore(selectSetShows);
  const setReservations = useCinemaStore(selectSetReservations);

  // component did mount
  useEffect(() => {
    setUser(user);
    setShows(shows);
    setReservations(reservations);
  }, [user]);

  return (
    <Box>
      <Container size="xl" mt="4rem">
        <ReservationOverview user={user} />
        <Flex px="md" align="center" gap="sm">
          <Text color="dimmed" size="xs" mb={2}>
            Powered by
          </Text>
          <Box h={40} opacity={0.5}>
            <PushhLogo />
          </Box>
        </Flex>
      </Container>
    </Box>
  );
};

export default DashboardPage;

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

import {
  createServerSupabaseClient,
  createBrowserSupabaseClient,
} from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/router";
import type { GetServerSideProps, NextPage } from "next";
import { Box, Button, Container, Title } from "@mantine/core";

import {
  useCinemaStore,
  selectSetShows,
  selectSetReservations,
} from "../hooks/useCinemaStore";

import type { Database } from "~/lib/database.types";
import ReservationForm, {
  type ReservationWithShow,
} from "~/components/ReservationForm";
import SeatSVG from "~/components/SeatSVG";

export const supabaseAuthClient = createBrowserSupabaseClient<Database>();

interface PropTypes {
  user: {
    email: string;
  };
  shows: Database["public"]["Tables"]["shows"]["Row"][];
  reservations: ReservationWithShow[];
}

const HomePage: NextPage<PropTypes> = ({ user, shows, reservations }) => {
  const router = useRouter();
  const setShows = useCinemaStore(selectSetShows);
  const setReservations = useCinemaStore(selectSetReservations);

  const handleLogout = async () => {
    const { error } = await supabaseAuthClient.auth.signOut();

    if (!error) {
      router.reload();
    }
  };

  setShows(shows);
  setReservations(reservations);

  return (
    <Box component="main">
      <Container>
        <Title>Hello {user.email}</Title>
        <Button onClick={() => void handleLogout()}>Logout</Button>
        <ReservationForm user={user} />
        <SeatSVG />
      </Container>
    </Box>
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
  // return {
  //   redirect: {
  //     destination: "/login",
  //     permanent: false,
  //   },
  // };

  const { data: reservations } = await supabaseAuthServer
    .from("reservations")
    .select(`*, show!inner (*)`);
  // .eq("show.date", "2023-05-02");

  const { data: shows } = await supabaseAuthServer.from("shows").select();

  return {
    props: {
      initialSession: session,
      user: session.user,
      shows,
      reservations,
    },
  };
};

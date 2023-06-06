import type { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
// supabase
import {
  createServerSupabaseClient,
  createBrowserSupabaseClient,
} from "@supabase/auth-helpers-nextjs";
// mantine
import { Box, Button, Container, Flex, Title } from "@mantine/core";
// zustand
import {
  useCinemaStore,
  selectSetShows,
  selectSetReservations,
} from "../hooks/useCinemaStore";
// dayjs
import dayjs from "dayjs";
// components
import ReservationForm from "~/components/booking/ReservationForm";
import ReservationDisplay from "~/components/booking/ReservationDisplay";
import SeatSVG from "~/components/cinema/SeatSVG";
// types
import type { Database } from "~/lib/database.types";
import type { ReservationWithShow } from "~/lib/general.types";

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
        <Flex
          justify="space-between"
          align="flex-start"
          direction="row"
          mt={"1.5rem"}
        >
          <Title order={4}>Hallo {user.email}</Title>
          <Button compact onClick={() => void handleLogout()}>
            Logout
          </Button>
        </Flex>
        <Flex
          justify="space-between"
          align="flex-start"
          direction="row"
          mt="2rem"
        >
          <Flex justify="flex-start" align="flex-start" direction="column">
            <ReservationForm user={user} />
            <ReservationDisplay />
          </Flex>
          <SeatSVG />
        </Flex>
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

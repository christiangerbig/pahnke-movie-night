import { useEffect, useState } from "react";
import { motion } from "framer-motion";
// supabase
import {
  createServerSupabaseClient,
  createBrowserSupabaseClient,
  type User,
} from "@supabase/auth-helpers-nextjs";
// mantine
import {
  Box,
  Container,
  Flex,
  Text,
  Header as MantineHeader,
} from "@mantine/core";
// zustand
import { useCinemaStore, selectSetUser } from "../hooks/useCinemaStore";
// dayjs
import dayjs from "../dayjs.config";
// components
import PushhLogo from "~/components/PushhLogo";
import ReservationsOverview from "~/components/booking/ReservationsOverview";
import ShowsOverview from "~/components/shows/ShowsOverview";
// types
import type { GetServerSideProps, NextPage } from "next";
import type { Database } from "~/lib/database.types";
import type { ReservationWithShow } from "~/lib/general.types";
import { Header } from "~/components/Header";
import AppLogo from "~/components/AppLogo";

export const supabaseAuthClient = createBrowserSupabaseClient<Database>();

interface PropTypes {
  user: User;
  shows: Database["public"]["Tables"]["shows"]["Row"][];
  userReservations: ReservationWithShow[];
}

const DashboardPage: NextPage<PropTypes> = ({
  user,
  shows,
  userReservations,
}) => {
  // zustand
  const setUser = useCinemaStore(selectSetUser);
  const [videoPlaying, setVideoPlaying] = useState(true);

  // component did mount
  useEffect(() => {
    setUser(user);
  }, []);

  if (videoPlaying)
    return (
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ delay: 3.2 }}
      >
        <Box
          pos="fixed"
          top={0}
          left={0}
          h="100%"
          sx={{ zIndex: 100 }}
          bg="#060606"
        >
          <video
            autoPlay
            muted
            style={{ height: "100%", width: "100%", objectFit: "cover" }}
            onEnded={() => {
              setVideoPlaying(false);
            }}
          >
            <source src="/filmpalast_ludwigstraße_logo-animation.mp4"></source>
          </video>
        </Box>
      </motion.div>
    );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <Box component="main">
        <MantineHeader
          height={62}
          bg="dark.9"
          sx={{
            position: "fixed",
            top: 0,
            "z-index": 10,
          }}
        >
          <Header />
        </MantineHeader>
        <Container size="md" mt={80}>
          <Flex h={220} justify="center" w="100%" my="xl">
            <AppLogo />
          </Flex>
          <ShowsOverview shows={shows} />
        </Container>
        <Container size="md">
          <ReservationsOverview reservations={userReservations} />
          <Flex my="lg" justify="end">
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
    </motion.div>
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

  const { data: userReservations } = await supabaseAuthServer
    .from("reservations")
    .select(`*, show(*)`)
    .filter("user", "eq", session.user.id);

  const { data: shows } = await supabaseAuthServer
    .from("shows")
    .select()
    .gte("date", dayjs(new Date()).format("YYYY-MM-DD"))
    .order("date", { ascending: true });

  const filteredUserReservations = (userReservations as ReservationWithShow[])
    ?.sort((a, b) =>
      a.show.date < b.show.date ? -1 : a.show.date > b.show.date ? 1 : 0,
    )
    .filter(
      (reservation) =>
        reservation.show.date >= dayjs(Date()).format("YYYY-MM-DD"),
    );

  return {
    props: {
      initialSession: session,
      user: session.user,
      shows,
      userReservations: filteredUserReservations,
    },
  };
};

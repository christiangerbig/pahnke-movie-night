import { useEffect, useState } from "react";
// next
import { useRouter } from "next/router";
import Head from "next/head";
// framer-motion
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
// locales
import translations from "../../public/locale/translations";
// components
import NavigationBar from "~/components/NavigationBar";
import LogoApp from "~/components/logos/LogoApp";
import LogoPush from "~/components/logos/LogoPushh";
import ReservationsOverview from "~/components/booking/ReservationsOverview";
import ShowsOverview from "~/components/shows/ShowsOverview";
// types
import type { GetServerSideProps, NextPage } from "next";
import type { Database } from "~/lib/database.types";
import type { ReservationWithShow, Locale } from "~/lib/general.types";

export const supabaseAuthClient = createBrowserSupabaseClient<Database>();

interface DashboardPageProps {
  user: User;
  shows: Database["public"]["Tables"]["shows"]["Row"][];
  userReservations: ReservationWithShow[];
}

const DashboardPage: NextPage<DashboardPageProps> = ({
  user,
  shows,
  userReservations,
}) => {
  const { locale } = useRouter();
  const setUser = useCinemaStore(selectSetUser);
  const [videoPlaying, setVideoPlaying] = useState(true);

  // Fetch component content for default language
  const {
    dashboardPage: { title },
  } = translations[locale as Locale];

  // hook component did mount
  useEffect(() => {
    setUser(user);
  }, []);

  if (videoPlaying)
    return (
      <>
        <Head>
          <title>{title}</title>
        </Head>
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
              style={{ height: "100%", width: "100%", objectFit: "scale-down" }}
              onEnded={() => {
                setVideoPlaying(false);
              }}
            >
              <source src="/filmpalast_ludwigstraße_logo-animation.mp4"></source>
            </video>
          </Box>
        </motion.div>
      </>
    );

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Box component="main">
          <MantineHeader
            height="4rem"
            bg="dark.9"
            sx={{
              position: "fixed",
              top: 0,
              "z-index": 10,
            }}
          >
            <NavigationBar />
          </MantineHeader>
          <Container size="md" mt="5rem">
            <Flex h="13.5rem" justify="center" w="100%" my="xl">
              <LogoApp />
            </Flex>
            <ShowsOverview shows={shows} />
          </Container>
          <Container size="md">
            <ReservationsOverview reservations={userReservations} />
            <Flex my="lg" justify="end">
              <LogoPush />
            </Flex>
          </Container>
        </Box>
      </motion.div>
    </>
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

import {
  createServerSupabaseClient,
  createBrowserSupabaseClient,
} from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/router";
import type { GetServerSideProps, NextPage } from "next";
import { Box, Button, Container, Title, Text } from "@mantine/core";

import type { Database } from "~/lib/database.types";

const supabaseAuthClient = createBrowserSupabaseClient<Database>();

interface PropTypes {
  user: {
    email: string;
  };
  reservations: Database["public"]["Tables"]["reservations"]["Row"];
  shows: Database["public"]["Tables"]["shows"]["Row"];
}

const HomePage: NextPage<PropTypes> = ({ user, reservations, shows }) => {
  const router = useRouter();

  const handleLogout = async () => {
    const { error } = await supabaseAuthClient.auth.signOut();

    if (!error) {
      router.reload();
    }
  };

  console.log("Reservations: ", reservations);
  console.log("Shows: ", shows);

  return (
    <Box component="main">
      <Container>
        <Title>Hello {user.email}</Title>
        <Button onClick={() => void handleLogout()}>Logout</Button>
        <Text>Session User:</Text>
        <Text component="pre" size="sm">
          {JSON.stringify(user, null, 2)}
        </Text>
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
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };

  const { data: reservations } = await supabaseAuthServer
    .from("reservations")
    .select(`*, show!inner (*)`)
    .eq("show.date", "2023-05-02");

  const { data: shows } = await supabaseAuthServer.from("shows").select();

  return {
    props: {
      initialSession: session,
      user: session.user,
      reservations,
      shows,
    },
  };
};

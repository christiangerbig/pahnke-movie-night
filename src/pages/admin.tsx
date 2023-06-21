// next
import Link from "next/link";
// mantine
import { Box, Container, Title, Button, Modal, Flex } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
// dayjs
import "dayjs/locale/de";
// components
import { CornerDownLeft } from "lucide-react";
import ShowAddForm from "~/components/shows/ShowAddForm";
import ShowsArchiv from "~/components/shows/ShowsArchiv";
// types
import type { GetServerSideProps, NextPage } from "next";
import type { Database } from "~/lib/database.types";

interface PropTypes {
  shows: Database["public"]["Tables"]["shows"]["Row"][];
}

const AdminPage: NextPage<PropTypes> = ({ shows }) => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Box component="main" my="xl">
        <Container>
          <Flex align="center" justify="space-between" mb="xl">
            <Flex align="center" gap={8}>
              <Box
                component={Link}
                href="/"
                sx={{ lineHeight: 0, color: "#C1C2C5" }}
              >
                <CornerDownLeft />
              </Box>
              <Title order={3}>Show Archiv</Title>
            </Flex>
            <Button size="xs" variant="default" onClick={open}>
              Show hinzufügen
            </Button>
          </Flex>
          <ShowsArchiv shows={shows} />
        </Container>
      </Box>
      <Modal
        opened={opened}
        onClose={close}
        title="Neue Show hinzufügen"
        size="xl"
      >
        <ShowAddForm closeModal={close} />
      </Modal>
    </>
  );
};

export default AdminPage;

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

  if (!session.user.user_metadata.admin)
    return {
      notFound: true,
    };

  const { data: shows } = await supabaseAuthServer
    .from("shows")
    .select(
      `
        *,
        reservations ( id )
  `,
    )
    .order("date", { ascending: true });

  return {
    props: {
      initialSession: session,
      user: session.user,
      shows,
    },
  };
};

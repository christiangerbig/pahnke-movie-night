// next
import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";
// mantine
import { Box, Container, Title, Button, Modal, Flex } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
// dayjs
import "dayjs/locale/de";
// locales
import translations from "../../public/locale/translations";
// components
import { CornerDownLeft } from "lucide-react";
import ShowAddForm from "~/components/shows/ShowAddForm";
import ShowsArchiv from "~/components/shows/ShowsArchive";
// types
import type { GetServerSideProps, NextPage } from "next";
import type { Database } from "~/lib/database.types";
import type { Locale } from "~/lib/general.types";

interface AdminPageProps {
  shows: Database["public"]["Tables"]["shows"]["Row"][];
}

const AdminPage: NextPage<AdminPageProps> = ({ shows }) => {
  const { locale } = useRouter();
  const [opened, { open, close }] = useDisclosure(false);

  // Fetch component content for default language
  const {
    adminPage: { title, button, modal },
  } = translations[locale as Locale];

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
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
              <Title order={3}>{title}</Title>
            </Flex>
            <Button size="xs" variant="default" onClick={open}>
              {button.addShow}
            </Button>
          </Flex>
          <ShowsArchiv shows={shows} />
        </Container>
      </Box>
      <Modal opened={opened} onClose={close} title={modal.title} size="xl">
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
    .select(`*, reservations ( id )`)
    .order("date", { ascending: true });

  return {
    props: {
      initialSession: session,
      user: session.user,
      shows,
    },
  };
};

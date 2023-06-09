import { Box, Button, Container, Title, Flex } from "@mantine/core";
import { useRouter } from "next/router";
import {
  User,
  createBrowserSupabaseClient,
} from "@supabase/auth-helpers-nextjs";

import { PushhLogo } from "./PushhLogo";
import type { Database } from "~/lib/database.types";

export const supabaseAuthClient = createBrowserSupabaseClient<Database>();

export const Header = ({ user }: { user: User }) => {
  const router = useRouter();
  const handleLogout = async () => {
    const { error } = await supabaseAuthClient.auth.signOut();

    if (!error) {
      router.reload();
    }
  };
  return (
    <Box h="100%" px="md">
      <Flex justify="space-between" align="center" h="100%">
        <Box>
          {/* <PushhLogo /> */}
          <Title order={4}>Hallo {user.email}</Title>
        </Box>
        <Button onClick={() => void handleLogout()} variant="default" size="xs">
          Logout
        </Button>
      </Flex>
    </Box>
  );
};

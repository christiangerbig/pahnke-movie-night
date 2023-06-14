// next
import { useRouter } from "next/router";
// zustand
import { useCinemaStore, selectUser } from "../hooks/useCinemaStore";
import Link from "next/link";
// supabase
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
// mantine
import { Box, Button, Title, Flex, Group } from "@mantine/core";
// components
import { CornerDownLeft } from "lucide-react";
// import PushhLogo from "./PushhLogo";
// types
import type { User } from "@supabase/auth-helpers-nextjs";
import type { Database } from "~/lib/database.types";

export const supabaseAuthClient = createBrowserSupabaseClient<Database>();

export const Header = () => {
  const router = useRouter();
  // zustand
  const user = useCinemaStore(selectUser);

  const handleLogout = async () => {
    const { error } = await supabaseAuthClient.auth.signOut();

    if (!error) {
      router.reload();
    }
  };

  return (
    <Box h="100%" px="md">
      <Flex justify="space-between" align="center" h="100%">
        <Box
          component={Link}
          href="/dashboard"
          sx={{ lineHeight: 0, color: "#C1C2C5" }}
        >
          <CornerDownLeft />
        </Box>

        {/* <PushhLogo /> */}
        <Title order={4}>Hallo {(user as User).email}</Title>
        <Group>
          <Button variant="default" size="xs" component={Link} href="/admin">
            Admim-Bereich
          </Button>
          <Button
            onClick={() => void handleLogout()}
            variant="default"
            size="xs"
          >
            Logout
          </Button>
        </Group>
      </Flex>
    </Box>
  );
};

import { useEffect, useState } from "react";
// next
import { useRouter } from "next/router";
// zustand
import { useCinemaStore, selectUser } from "../hooks/useCinemaStore";
import Link from "next/link";
// supabase
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
// mantine
import { Box, Button, Title, Flex, Group } from "@mantine/core";
// locales
import translations from "../../public/locale/translations";
// components
import { CornerDownLeft } from "lucide-react";
// types
import type { User } from "@supabase/auth-helpers-nextjs";
import type { Database } from "~/lib/database.types";
import type { Locale } from "~/lib/general.types";

export const supabaseAuthClient = createBrowserSupabaseClient<Database>();

const NavigationBar = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isDashboard, setIsDashboard] = useState<boolean>(true);
  const { asPath, reload, replace, pathname, locale } = useRouter();
  const user = useCinemaStore(selectUser);

  // Fetch component content for default language
  const { navigationBar } = translations[locale as Locale];

  // hook component did mount
  useEffect(() => {
    if (asPath === "/dashboard") {
      setIsDashboard(true);
      return;
    }
    setIsDashboard(false);
  }, []);

  // hook user change
  useEffect(() => {
    (user as User).user_metadata &&
      setIsAdmin((user as User).user_metadata.admin as boolean);
  }, [user]);

  const handleChangeLanguage = () => {
    if (locale === "de-DE") replace(pathname, pathname, { locale: "en-US" });
    else {
      replace(pathname, pathname, { locale: "de-DE" });
    }
  };

  const handleLogout = async () => {
    const { error } = await supabaseAuthClient.auth.signOut();

    if (!error) {
      reload();
    }
  };

  return (
    <Box h="100%" px="md">
      <Flex justify="space-between" align="center" h="100%">
        <Group>
          {!isDashboard ? (
            <Box
              w="1.5rem"
              component={Link}
              href="/dashboard"
              sx={{ lineHeight: 0, color: "#C1C2C5" }}
            >
              <CornerDownLeft />
            </Box>
          ) : (
            <Box w="1.5rem" />
          )}
          <Title order={4}>
            {navigationBar.text} {(user as User).email}
          </Title>
        </Group>
        <Group>
          <Button
            variant="default"
            size="xs"
            onClick={() => void handleChangeLanguage()}
          >
            {navigationBar.button.language}
          </Button>
          {isAdmin ? (
            <Button variant="default" size="xs" component={Link} href="/admin">
              {navigationBar.button.admin}
            </Button>
          ) : null}
          <Button
            variant="default"
            size="xs"
            onClick={() => void handleLogout()}
          >
            {navigationBar.button.logout}
          </Button>
        </Group>
      </Flex>
    </Box>
  );
};

export default NavigationBar;

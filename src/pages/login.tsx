import { useState } from "react";
// next
import { useRouter } from "next/router";
import Head from "next/head";
// supabase
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useSessionContext } from "@supabase/auth-helpers-react";
// mantine
import {
  TextInput,
  Paper,
  Title,
  Button,
  Flex,
  Box,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useViewportSize } from "@mantine/hooks";
// helpers
import { validateEmail } from "~/lib/validateEmail";
// locales
import translations from "../../public/locale/translations";
// components
import LogoPush from "~/components/LogoPushh";
// types
import type { Locale } from "~/lib/general.types";

const supabaseClient = createBrowserSupabaseClient();

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const { push, locale } = useRouter();
  const { session, isLoading } = useSessionContext();
  // Fetch component content for default language
  const { loginPage } = translations[locale as Locale];

  const form = useForm({
    initialValues: {
      email: "",
    },
    validate: {
      email: validateEmail,
    },
  });
  const { height } = useViewportSize();

  const handleLogin = async (email: string) => {
    setLoading(true);

    const { error } = await supabaseClient.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: "/login",
      },
    });

    if (!error) {
      void push("/verify-request");
    }

    setLoading(false);
  };

  if (isLoading) {
    return;
  }

  if (session) {
    void push("/dashboard");
    return;
  }

  return (
    <>
      <Head>
        <title>{loginPage.title}</title>
      </Head>
      <Box component="main">
        <Flex justify="center" align="center" direction="column" h={height}>
          <Title align="center" order={1}>
            {loginPage.title}
          </Title>
          <form
            onSubmit={form.onSubmit((values) => void handleLogin(values.email))}
          >
            <Paper
              withBorder
              shadow="md"
              p="2rem"
              mt="2rem"
              radius="md"
              w="26rem"
            >
              <TextInput
                label="E-Mail"
                placeholder="meine@email.com"
                size="xs"
                withAsterisk
                {...form.getInputProps("email")}
              />
              <Button
                type="submit"
                fullWidth
                mt="xl"
                loading={loading}
                size="xs"
              >
                {loginPage.button.submit}
              </Button>
            </Paper>
          </form>
          <Flex px="md" align="center" gap="sm" mt="2rem">
            <Text color="dimmed" size="xs" mb={2}>
              {loginPage.logo.text}
            </Text>
            <Box h={40} opacity={0.5}>
              <LogoPush />
            </Box>
          </Flex>
        </Flex>
      </Box>
    </>
  );
};

export default LoginPage;

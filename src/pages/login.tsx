import { useState } from "react";
// next
import { useRouter } from "next/router";
import Head from "next/head";
// supabase
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useSessionContext } from "@supabase/auth-helpers-react";
// mantine
import { TextInput, Paper, Title, Button, Flex, Box } from "@mantine/core";
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
  const form = useForm({
    initialValues: {
      email: "",
    },
    validate: {
      email: validateEmail,
    },
  });
  const { height } = useViewportSize();

  // Fetch component content for default language
  const {
    loginPage: { title, button },
  } = translations[locale as Locale];

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
        <title>{title}</title>
      </Head>
      <Box component="main">
        <Flex justify="center" align="center" direction="column" h={height}>
          <Title align="center" order={1}>
            {title}
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
                {button.submit}
              </Button>
            </Paper>
          </form>
          <LogoPush />
        </Flex>
      </Box>
    </>
  );
};

export default LoginPage;

import { useState } from "react";
// next
import { useRouter } from "next/router";
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
import { PushhLogo } from "~/components/PushhLogo";

const supabaseClient = createBrowserSupabaseClient();

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  // supabase hooks
  const { session, isLoading } = useSessionContext();
  // mantine hooks
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
      void router.push("/verify-request");
    }

    setLoading(false);
  };

  if (isLoading) {
    return;
  }

  if (session) {
    void router.push("/");
    return;
  }

  return (
    <Box component="main">
      <Flex justify="center" align="center" direction="column" h={height}>
        <Title align="center" order={1}>
          Willkommen!
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
              withAsterisk
              {...form.getInputProps("email")}
            />
            <Button type="submit" fullWidth mt="xl" loading={loading}>
              Einloggen
            </Button>
          </Paper>
        </form>
        <Flex px="md" align="center" gap="sm" mt="2rem">
          <Text color="dimmed" size="xs" mb={2}>
            Powered by
          </Text>
          <Box h={40} opacity={0.5}>
            <PushhLogo />
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
};

export default LoginPage;

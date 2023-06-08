import { useState } from "react";
// next
import { useRouter } from "next/router";
// supabase
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useSessionContext } from "@supabase/auth-helpers-react";
// mantine
import { TextInput, Container, Button, Stack, Box, Title } from "@mantine/core";
import { useForm } from "@mantine/form";

const supabaseClient = createBrowserSupabaseClient();

const validateEmail = (value: string) => {
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  const emailDomain = value.split("@")[1] || "";
  const allowedDomains = ["pahnke.de", "pushh.it", "pinc.de", "fluent.de"];

  if (!emailRegex.test(value)) {
    return "Keine gültige E-Mail-Adresse";
  }

  if (!allowedDomains.includes(emailDomain)) {
    return "E-Mail Provider nicht zugelassen";
  }

  return false;
};

const LoginPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { session, isLoading } = useSessionContext();
  // mantine form
  const form = useForm({
    initialValues: {
      email: "",
    },
    validate: {
      email: validateEmail,
    },
  });

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
      <Container size="xs">
        <Stack>
          <Title>Login</Title>
          <form
            onSubmit={form.onSubmit((values) => void handleLogin(values.email))}
          >
            <Stack>
              <TextInput
                label="E-Mail"
                placeholder="your@email.com"
                withAsterisk
                {...form.getInputProps("email")}
              />
              <Button type="submit" loading={loading}>
                Einloggen
              </Button>
            </Stack>
          </form>
        </Stack>
      </Container>
    </Box>
  );
};

export default LoginPage;

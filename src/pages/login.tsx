import { useState } from "react";
// next
import { useRouter } from "next/router";
// supabase
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useSessionContext } from "@supabase/auth-helpers-react";
// mantine
import { TextInput, Paper, Title, Container, Button } from "@mantine/core";
import { useForm } from "@mantine/form";
// helpers
import { validateEmail } from "~/lib/validateEmail";

const supabaseClient = createBrowserSupabaseClient();

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
    <Container size="26rem" my="2.5rem">
      <Title align="center" order={1}>
        Willkommen!
      </Title>
      <form
        onSubmit={form.onSubmit((values) => void handleLogin(values.email))}
      >
        <Paper withBorder shadow="md" p="2rem" mt="2rem" radius="md">
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
    </Container>
  );
};

export default LoginPage;

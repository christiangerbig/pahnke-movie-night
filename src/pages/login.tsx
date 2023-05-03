import {
  createBrowserSupabaseClient,
  createServerSupabaseClient,
} from "@supabase/auth-helpers-nextjs";
import { TextInput, Container, Button, Stack, Box, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useRouter } from "next/router";
import type { GetServerSideProps } from "next";

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
  const form = useForm({
    initialValues: {
      email: "",
    },

    validate: {
      email: validateEmail,
    },
  });

  const handleLogin = async (email: string) => {
    const { error } = await supabaseClient.auth.signInWithOtp({
      email,
    });

    if (!error) {
      void router.push("/verify-request");
    }
  };

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
              <Button type="submit">Einloggen</Button>
            </Stack>
          </form>
        </Stack>
      </Container>
    </Box>
  );
};

export default LoginPage;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  // Create authenticated Supabase Client
  const supabaseServer = createServerSupabaseClient(ctx);
  // Check if we have a session
  const {
    data: { session },
  } = await supabaseServer.auth.getSession();

  if (session)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };

  return {
    props: {},
  };
};

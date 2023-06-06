import { useState } from "react";
// supabase
import {
  SessionContextProvider,
  type Session,
} from "@supabase/auth-helpers-react";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
// mantine
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
// styles
import "~/styles/globals.css";
// types
import type { AppProps } from "next/app";

const App = ({
  Component,
  pageProps,
}: AppProps<{ initialSession: Session }>) => {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient());

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colorScheme: "dark",

          globalStyles: () => ({
            body: {
              backgroundColor: "#060606",
            },
          }),
        }}
      >
        <Notifications />
        <Component {...pageProps} />
      </MantineProvider>
    </SessionContextProvider>
  );
};

export default App;

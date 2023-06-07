import { useState } from "react";
// supabase
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
// mantine
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
// styles
import "~/styles/globals.css";
// dayjs
import "~/dayjs.config";
// types
import type { AppProps } from "next/app";
import type { Session } from "@supabase/auth-helpers-react";

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

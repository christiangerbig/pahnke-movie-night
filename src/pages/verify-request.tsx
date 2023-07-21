// next
import { useRouter } from "next/router";
import Head from "next/head";
// mantine
import { Box, Flex, Paper, Text } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
// locales
import translations from "../../public/locale/translations";
// types
import type { Locale } from "~/lib/general.types";

const VerifyRequestPage = () => {
  const { locale } = useRouter();
  const { height } = useViewportSize();

  // Fetch component content for default language
  const {
    verifyRequestPage: { title, text },
  } = translations[locale as Locale];

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <Box component="main">
        <Flex justify="center" align="center" direction="column" h={height}>
          <Paper withBorder shadow="md" p="2.5rem" radius="md">
            <Text align="center" size="xl">
              {text}
            </Text>
          </Paper>
        </Flex>
      </Box>
    </>
  );
};

export default VerifyRequestPage;

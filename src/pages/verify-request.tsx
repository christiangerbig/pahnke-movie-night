import { Box, Flex, Paper, Text } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";

const VerifyRequestPage = () => {
  const { height } = useViewportSize();

  return (
    <Box component="main">
      <Flex justify="center" align="center" direction="column" h={height}>
        <Paper withBorder shadow="md" p="2.5rem" radius="md">
          <Text align="center" size="xl">
            Eine E-mail mit einem Bestätigungslink wurde an dein Postfach
            gesendet.
          </Text>
        </Paper>
      </Flex>
    </Box>
  );
};

export default VerifyRequestPage;

import { useRouter } from "next/router";
// mantine
import { Card, Group, Image, Text, Button, Flex } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
// dayjs
import dayjs from "../../dayjs.config";
// locales
import translations from "../../../public/locale/translations";
// components
import { Clock3, CalendarDays, ArrowRight } from "lucide-react";
// types
import type { Locale, Show } from "~/lib/general.types";

interface ShowCardProps {
  show: Show;
}

const ShowCard = ({
  show: { id, movie_title, movie_poster, time, date },
}: ShowCardProps) => {
  const { push, locale } = useRouter();
  const isBreakpointSM = useMediaQuery("(max-width: 48rem)");

  // Fetch component content for default language
  const { showCard } = translations[locale as Locale];

  const handleToHomePage = (id: string) => {
    void push(`/?show=${id}`);
  };

  return (
    <Card shadow="md" padding="lg" radius="md" withBorder bg="dark.9" mb="md">
      <Flex direction="row" w="100%" gap="lg">
        <Image
          src={movie_poster}
          height="9.4rem"
          width="auto"
          alt="movie poster"
          radius="md"
        />
        <Flex
          justify="space-between"
          align="flex-start"
          direction="column"
          w="100%"
        >
          <Text size="1.7rem" fw="bold">
            {movie_title}
          </Text>
          <Flex
            align="flex-center"
            justify="space-between"
            direction={isBreakpointSM ? "column" : "row"}
            w="100%"
          >
            <Flex gap="xl" mt={isBreakpointSM ? "2rem" : undefined}>
              <Group>
                <CalendarDays size="1.5rem" />
                <Flex direction="column">
                  <Text component="span" size="xs" color="dimmed">
                    {showCard.date.text}
                  </Text>
                  <Text size="sm" fw="bold">
                    {dayjs(date).format("dd. DD.MM.YYYY").toString()}
                  </Text>
                </Flex>
              </Group>
              <Group>
                <Clock3 size="1.5rem" />
                <Flex direction="column">
                  <Text component="span" size="xs" color="dimmed">
                    {showCard.time.text}
                  </Text>
                  <Text size="sm" fw="bold">
                    {time?.slice(0, 5)}
                  </Text>
                </Flex>
              </Group>
            </Flex>
            <Button
              onClick={() => {
                handleToHomePage(id.toString());
              }}
              color="blue.7"
              rightIcon={<ArrowRight size="1rem" />}
              mt={isBreakpointSM ? "1.5rem" : "auto"}
              w={isBreakpointSM ? "70%" : "25%"}
              size="xs"
            >
              {showCard.button.book}
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
};

export default ShowCard;

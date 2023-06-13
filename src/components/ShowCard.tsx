import { Clock3, CalendarDays, ArrowRight } from "lucide-react";
// next
import { useRouter } from "next/router";
// zustand
import { useCinemaStore, selectSetSelectedShow } from "../hooks/useCinemaStore";
// Mantine
import { Card, Group, Image, Text, Button, Flex } from "@mantine/core";
// dayjs
import dayjs from "../dayjs.config";
// types
import type { Show } from "~/lib/general.types";

interface ShowCardProps {
  show: Show;
}
const ShowCard = ({
  show: { id, movie_title, movie_poster, time, date },
}: ShowCardProps) => {
  const router = useRouter();
  const setSelectedShow = useCinemaStore(selectSetSelectedShow);

  const handleClick = (event: any, id: string) => {
    setSelectedShow(id);
    console.log(id);
    void router.push("/");
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder w="70%" mb="2rem">
      <Flex direction="row" w="100%" gap="md">
        <Card.Section ml="0rem">
          <Image
            src={movie_poster}
            height="12rem"
            width="8rem"
            alt="movie poster"
            radius="md"
          />
        </Card.Section>
        <Flex
          justify="space-between"
          align="flex-start"
          direction="column"
          gap="md"
          ml="2rem"
          w="100%"
        >
          <Text size="xl" weight={800} w="8rem" mt="1rem">
            {movie_title}
          </Text>
          <Flex
            align="flex-center"
            justify="space-between"
            direction="row"
            gap="lg"
            w="100%"
          >
            <Group>
              <Group>
                <Clock3 size="1rem" />
                <Text size="xs">{time?.slice(0, 5)}</Text>
              </Group>
              <Group ml="3rem">
                <CalendarDays size="1rem" />
                <Text size="xs">
                  {dayjs(date).format("dd. DD.MM.YYYY").toString()}
                </Text>
              </Group>
            </Group>
            <Button
              onClick={(event) => {
                handleClick(event, id.toString());
              }}
              variant="light"
              color="blue"
              radius="md"
              size="xs"
            >
              <Text mr="0.8rem">Zur Buchung</Text>
              <ArrowRight size="1rem" />
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
};

export default ShowCard;

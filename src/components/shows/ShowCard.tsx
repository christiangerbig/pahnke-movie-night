// next
import { useRouter } from "next/router";
// mantine
import {
  Card,
  Group,
  Image,
  Text,
  Button,
  Flex,
  Skeleton,
} from "@mantine/core";
// dayjs
import dayjs from "../../dayjs.config";
// components
import { Clock3, CalendarDays, ArrowRight } from "lucide-react";
// types
import type { Show } from "~/lib/general.types";

interface ShowCardProps {
  show: Show;
}
const ShowCard = ({
  show: { id, movie_title, movie_poster, time, date },
}: ShowCardProps) => {
  const router = useRouter();

  const handleToHomePage = (id: string) => {
    void router.push(`/?show=${id}`);
  };

  return (
    <Card shadow="md" padding="lg" radius="md" withBorder bg="dark.9" mb="md">
      <Flex direction="row" w="100%" gap="lg">
        <Image
          src={movie_poster}
          height={150}
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
          <Text size={28} fw="bold">
            {movie_title}
          </Text>
          <Flex
            align="flex-center"
            justify="space-between"
            direction="row"
            w="100%"
          >
            <Flex gap="xl">
              <Group>
                <CalendarDays size={24} />
                <Flex direction="column">
                  <Text component="span" size="xs" color="dimmed">
                    Datum
                  </Text>
                  <Text fw="bold">
                    {dayjs(date).format("dd. DD.MM.YYYY").toString()}
                  </Text>
                </Flex>
              </Group>
              <Group>
                <Clock3 size={24} />
                <Flex direction="column">
                  <Text component="span" size="xs" color="dimmed">
                    Uhrzeit
                  </Text>
                  <Text fw="bold">{time?.slice(0, 5)}</Text>
                </Flex>
              </Group>
            </Flex>
            <Button
              onClick={() => {
                handleToHomePage(id.toString());
              }}
              color="indigo"
              rightIcon={<ArrowRight size={16} />}
            >
              Plätze buchen
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Card>
  );
};

export default ShowCard;

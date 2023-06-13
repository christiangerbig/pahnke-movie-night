import { PropsWithChildren, useEffect, useState } from "react";
import {
  AppShell,
  Box,
  Button,
  Navbar,
  Text,
  Image,
  Header as MantineHeader,
  Flex,
  Card,
  Skeleton,
} from "@mantine/core";
import type { User } from "@supabase/supabase-js";
import dayjs from "dayjs";

import { Header } from "./Header";
import ReservationForm from "./booking/ReservationForm";
import {
  selectSelectedShow,
  selectShows,
  useCinemaStore,
} from "~/hooks/useCinemaStore";
import { Trash } from "lucide-react";

export const Layout: React.FC<{ user: User | object } & PropsWithChildren> = ({
  user,
  children,
}) => {
  const selectedShowId = useCinemaStore(selectSelectedShow);
  const show = useCinemaStore(selectShows).filter(
    (show) => show.id === Number(selectedShowId),
  )[0];

  const handleDelete = () => {
    console.log("TEST");
  };

  return (
    <>
      <AppShell
        padding={0}
        header={
          <MantineHeader height={62} bg="dark.9">
            <Header user={user} />
          </MantineHeader>
        }
        navbar={
          <Navbar width={{ base: 300 }} pt="md" bg="dark.9">
            <Flex direction="column" h="100%">
              <Navbar.Section sx={{ flex: "1 1 0%" }} px="md">
                <Text size="md" weight={500} color="dimmed" mb="sm">
                  Vorstellung wählen
                </Text>
                <ReservationForm user={user} />
              </Navbar.Section>
              <Navbar.Section px="md" w="100%">
                <Button
                  color="red"
                  leftIcon={<Trash size={16} />}
                  w="100%"
                  variant="outline"
                  onClick={handleDelete}
                >
                  Buchung stornieren
                </Button>
              </Navbar.Section>
              <Navbar.Section sx={{ flex: "0 1 0%" }}>
                <Skeleton visible={!show} mt="lg">
                  <Card mt="lg" shadow="unset" pb="lg" radius={0} bg="dark.6">
                    <Text mt="md" weight="bold" my={0}>
                      <Text component="span" color="dimmed" weight="normal">
                        Titel:{" "}
                      </Text>
                      {show?.movie_title}
                    </Text>
                    <Text mt="md" weight="bold" my={4}>
                      <Text
                        component="span"
                        color="dimmed"
                        weight="normal"
                        m={0}
                      >
                        Datum:{" "}
                      </Text>
                      {dayjs(show?.date).format("dd. DD.MM.YYYY")}{" "}
                    </Text>
                    <Text mt="md" my={0}>
                      <Text component="span" color="dimmed" weight="normal">
                        Uhrzeit:{" "}
                      </Text>
                    </Text>
                    {show?.movie_poster && (
                      <Image
                        src={show?.movie_poster}
                        alt=""
                        height={398}
                        mt="md"
                        radius={8}
                      />
                    )}
                  </Card>
                </Skeleton>
              </Navbar.Section>
            </Flex>
          </Navbar>
        }
      >
        <Box>{children}</Box>
      </AppShell>
    </>
  );
};

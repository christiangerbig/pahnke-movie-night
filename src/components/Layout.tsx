import { useState, useEffect } from "react";
// zustand
import {
  selectSelectedShow,
  selectShows,
  useCinemaStore,
} from "~/hooks/useCinemaStore";
// mantine
import {
  AppShell,
  Box,
  Navbar,
  Text,
  Image,
  Header as MantineHeader,
  Flex,
  Card,
  Skeleton,
  Divider,
} from "@mantine/core";
// dayjs
import dayjs from "dayjs";
// components
import { CalendarDays, Clock3 } from "lucide-react";
import ReservationForm from "./booking/ReservationForm";
import Header from "./Header";
// types
import type { Show } from "~/lib/general.types";
import type { PropsWithChildren } from "react";

const Layout = ({ children }: PropsWithChildren) => {
  const [show, setShow] = useState<Show>();
  // zustand
  const shows = useCinemaStore(selectShows);
  const selectedShowId = useCinemaStore(selectSelectedShow);

  // hook selectedShowId change
  useEffect(() => {
    setShow(
      shows.filter((show: Show) => show.id === Number(selectedShowId))[0],
    );
  }, [selectedShowId]);

  return (
    <>
      <AppShell
        padding={0}
        header={
          <MantineHeader
            height="4rem"
            bg="dark.9"
            sx={{
              position: "fixed",
              top: 0,
              "z-index": 10,
            }}
          >
            <Header />
          </MantineHeader>
        }
        navbar={
          <Navbar
            width={{ base: "18.5rem" }}
            pt="md"
            bg="#060606"
            sx={{ overflowY: "auto" }}
          >
            <Flex direction="column" h="100%">
              <Navbar.Section sx={{ flex: "1 1 0%" }} px="md">
                <Text size="sm" weight={500} color="dimmed" mb="sm">
                  Vorstellung wählen
                </Text>
                <ReservationForm />
              </Navbar.Section>

              <Navbar.Section sx={{ flex: "0 1 0%" }}>
                <Skeleton visible={!show} mt="lg">
                  <Card mt="lg" shadow="unset" pb="lg" radius={0} bg="dark.9">
                    <Text mt="md" weight="bold" my={0}>
                      {show?.movie_title}
                    </Text>
                    <Flex mt="md" my={4} align="center" gap="xs">
                      <CalendarDays size={15} />
                      <Text size="sm" weight="bold">
                        {dayjs(show?.date).format("dd. DD.MM.YYYY")}{" "}
                      </Text>
                      <Divider orientation="vertical" />
                      <Clock3 size={15} />
                      <Text size="sm" weight="bold">
                        {show?.time?.slice(0, 5)}
                      </Text>
                    </Flex>
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

export default Layout;

import { useRouter } from "next/router";
import { useDisclosure } from "@mantine/hooks";
// mantine
import {
  Box,
  Button,
  Table,
  Text,
  Title,
  Card,
  Modal,
  Flex,
} from "@mantine/core";
// dayjs
import dayjs from "../../dayjs.config";
// api
import { deleteReservation } from "../../api/deleteReservation";
// components
import { Trash } from "lucide-react";
// types
import type { ReservationWithShow } from "~/lib/general.types";
import { useState } from "react";
import { notifications } from "@mantine/notifications";

interface PropTypes {
  reservations: ReservationWithShow[];
}

const ReservationOverview: React.FC<PropTypes> = ({ reservations }) => {
  const router = useRouter();
  const [opened, { open, close }] = useDisclosure(false);
  const [reservationId, setReservationId] = useState<number[]>([]);

  return (
    <>
      <Box my={72}>
        <Title order={2} size="h2">
          🍿 Meine Reservierungen
        </Title>
        <Card bg="dark.9" pt={0} mt="xl" withBorder>
          {reservations?.length === 0 ? (
            <Text mt="md" w="full" align="center">
              😔 Keine Reservierungen gefunden
            </Text>
          ) : (
            <Table fontSize="md" verticalSpacing="md" highlightOnHover>
              <thead>
                <tr>
                  <th>Datum</th>
                  <th>Film</th>
                  <th>Platznummer(n)</th>
                  <th>Gast</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {reservations?.map((reservation) => (
                  <tr key={reservation.id}>
                    <td>
                      {dayjs(reservation.show.date)
                        .format("DD. MMMM YYYY")
                        .toString()}
                    </td>
                    <td>{reservation.show.movie_title}</td>
                    <td>{reservation.seat}</td>
                    <td>
                      {reservation.guest_firstname} {reservation.guest_surname}
                    </td>
                    <td style={{ display: "flex", justifyContent: "flex-end" }}>
                      <Button
                        color="red"
                        leftIcon={<Trash size={16} />}
                        variant="outline"
                        onClick={() => {
                          setReservationId([reservation.id]);
                          open();
                        }}
                      >
                        Stornieren
                      </Button>
                    </td>
                  </tr>
                ))}
                <tr></tr>
              </tbody>
            </Table>
          )}
        </Card>
      </Box>
      <Modal
        opened={opened}
        onClose={close}
        centered
        title="Stornierung"
        size="xl"
      >
        <Text size="sm">Soll(en) die Reservierung(en) storniert werden?</Text>
        <Flex mt="xl" gap="md" justify="flex-end">
          <Button variant="default" onClick={close}>
            Nein, lass&apos; mal
          </Button>
          <Button
            color="red"
            onClick={() => {
              deleteReservation(reservationId)
                .then((): void => {
                  void router.replace(router.asPath);
                  notifications.show({
                    title: "Stornierung erfolgreich",
                    message: "Reservierung wurde storniert!",
                    color: "green",
                  });
                })
                .catch((err: Error) => {
                  console.log("Fehler:", err);
                  notifications.show({
                    title: "Ups, ein Fehler ist aufgetreten!",
                    message: err.message,
                    color: "red",
                  });
                });

              close();
            }}
          >
            Ja, stornieren
          </Button>
        </Flex>
      </Modal>
    </>
  );
};

export default ReservationOverview;

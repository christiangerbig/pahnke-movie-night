import { useRouter } from "next/router";
// mantine
import { Box, Button, Table, Text, Title, Card } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { modals } from "@mantine/modals";
// dayjs
import dayjs from "../../dayjs.config";
// api
import { deleteReservation } from "../../api/deleteReservation";
// components
import { Trash } from "lucide-react";
// types
import type { ReservationWithShow } from "~/lib/general.types";

interface ReservationOverviewProps {
  reservations: ReservationWithShow[];
}

const ReservationOverview = ({ reservations }: ReservationOverviewProps) => {
  const router = useRouter();

  // cangel reservation
  const cancelReservation = ({ show: { id } }: ReservationWithShow) => {
    modals.openConfirmModal({
      title: "Stornierung",
      centered: true,
      children: (
        <Text size="sm">Solle(n) die Reservierungen storniert werden?</Text>
      ),
      labels: { confirm: "Ja", cancel: "Nein" },
      confirmProps: { color: "red" },
      onCancel: () => {
        return;
      },
      onConfirm: () => {
        const reservationIds = reservations
          .filter((reservation) => {
            return reservation.show.id === id;
          })
          .map((reservation) => {
            return reservation.id;
          });

        deleteReservation(reservationIds)
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
      },
    });
  };

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
                    {!reservation.is_guest ? (
                      <td>
                        {dayjs(reservation.show.date)
                          .format("DD. MMMM YYYY")
                          .toString()}
                      </td>
                    ) : (
                      <td />
                    )}
                    {!reservation.is_guest ? (
                      <td>{reservation.show.movie_title}</td>
                    ) : (
                      <td />
                    )}

                    <td>{reservation.seat}</td>
                    <td>
                      {reservation.guest_firstname} {reservation.guest_surname}
                    </td>
                    <td style={{ display: "flex", justifyContent: "flex-end" }}>
                      {!reservation.is_guest ? (
                        <Button
                          color="red"
                          leftIcon={<Trash size={16} />}
                          variant="outline"
                          onClick={() => {
                            cancelReservation(reservation);
                          }}
                        >
                          Stornieren
                        </Button>
                      ) : null}
                    </td>
                  </tr>
                ))}
                <tr></tr>
              </tbody>
            </Table>
          )}
        </Card>
      </Box>
    </>
  );
};

export default ReservationOverview;

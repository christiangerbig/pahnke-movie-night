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
      // Cancellation
      onConfirm: () => {
        const reservationIds = reservations
          .filter(({ show }) => {
            return show.id === id;
          })
          .map(({ id }) => {
            return id;
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
                  <th />
                </tr>
              </thead>
              <tbody>
                {reservations?.map((reservation) => {
                  const {
                    id,
                    is_guest,
                    show: { date, movie_title },
                  } = reservation;
                  return (
                    !is_guest && (
                      <tr key={id}>
                        <td>
                          {dayjs(date).format("DD. MMMM YYYY").toString()}
                        </td>
                        <td>{movie_title}</td>
                        <td>
                          {reservations
                            ?.map((reservation: ReservationWithShow) =>
                              reservation.show.date === date
                                ? reservation.seat
                                : null,
                            )
                            .filter((reservation) => reservation !== null)
                            .join()}
                        </td>
                        <td>
                          {/* {guest_firstname} {guest_surname} */}
                          {reservations
                            ?.map((reservation: ReservationWithShow) =>
                              reservation.show.date === date
                                ? reservation.is_guest
                                  ? reservation.guest_firstname
                                  : null
                                : null,
                            )
                            .filter((reservation) => reservation !== null)}{" "}
                          {reservations
                            ?.map((reservation: ReservationWithShow) =>
                              reservation.show.date === date
                                ? reservation.is_guest
                                  ? reservation.guest_surname
                                  : null
                                : null,
                            )
                            .filter((reservation) => reservation !== null)}
                        </td>
                        <td
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                        >
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
                        </td>
                      </tr>
                    )
                  );
                })}
              </tbody>
            </Table>
          )}
        </Card>
      </Box>
    </>
  );
};

export default ReservationOverview;

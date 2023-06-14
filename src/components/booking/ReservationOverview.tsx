import { useEffect, useState } from "react";
// zustand
import {
  useCinemaStore,
  selectUser,
  selectReservations,
  selectSetReservations,
} from "../../hooks/useCinemaStore";
// mantine
import { Box, Button, Table, Title, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { modals } from "@mantine/modals";
// dayjs
import dayjs from "../../dayjs.config";
// api
import { deleteReservation } from "../../api/deleteReservation";
import { fetchReservations } from "../../api/fetchReservations";
// types
import type { ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import type { ReservationWithShow } from "~/lib/general.types";

interface TableElement {
  showDate: string;
  showTitle: string;
  seat: number;
  isGuest: boolean | null;
  guestFirstName: string | null;
  guestSurname: string | null;
}

const ReservationOverview = () => {
  const [userReservations, setUserReservations] = useState<
    ReservationWithShow[]
  >([]);
  const [tableElements, setTableElements] = useState<TableElement[]>([]);
  const [tableRows, setTableRows] = useState<ReactNode[]>([]);
  // zustand
  const user = useCinemaStore(selectUser);
  const reservations = useCinemaStore(selectReservations);
  const setReservations = useCinemaStore(selectSetReservations);

  // hook reservations change
  useEffect(() => {
    setUserReservations(
      reservations?.filter((reservation) => {
        return reservation.user === (user as User).id;
      }),
    );
  }, [reservations]);

  // hook userReservations change
  useEffect(() => {
    setTableElements(
      userReservations
        .map(
          ({
            show: { date, movie_title },
            seat,
            is_guest,
            guest_firstname,
            guest_surname,
          }: ReservationWithShow) => {
            return {
              showDate: date,
              showTitle: movie_title,
              seat,
              isGuest: is_guest,
              guestFirstName: guest_firstname,
              guestSurname: guest_surname,
            };
          },
        )
        .sort((a: TableElement, b: TableElement) =>
          a.showDate < b.showDate ? -1 : a.showDate > b.showDate ? 1 : 0,
        )
        .filter(
          ({ showDate }: TableElement) =>
            showDate >= dayjs(Date()).format("YYYY-MM-DD").toString(),
        ),
    );
  }, [userReservations]);

  // hook tableElements change
  useEffect(() => {
    // cancellation check
    const handleDeleteReservation = (event: any, showDate: string) => {
      modals.openConfirmModal({
        title: "Stornierung",
        centered: true,
        children: (
          <Text size="sm">Soll(en) die Reservierung(en) storniert werden?</Text>
        ),
        labels: { confirm: "Stornieren", cancel: "Nein, lass' mal" },
        confirmProps: { color: "red" },
        onCancel: () => {
          return;
        },
        // cancellation
        onConfirm: () => {
          const cancellationReservations = userReservations.filter(
            (reservation) => {
              return reservation.show.date === showDate;
            },
          );

          const reservationIDs = cancellationReservations.map((reservation) => {
            return reservation.id;
          });

          deleteReservation(reservationIDs)
            .then((): void => {
              notifications.show({
                title: "",
                message: "Die Reservierung wurde storniert.",
                color: "green",
                autoClose: 5000,
              });
              fetchReservations()
                .then((updatedReservations): void => {
                  setReservations(updatedReservations as ReservationWithShow[]);
                })
                .catch((err) => {
                  console.log("Fehler:", err);
                });
            })
            .catch((err) => {
              console.log("Fehler:", err);
            });
        },
      });
    };

    setTableRows(
      tableElements.map(
        (
          { showDate, showTitle, seat, isGuest, guestFirstName, guestSurname },
          index,
        ) => (
          <tr key={index.toString()}>
            {isGuest ? (
              <td />
            ) : (
              <td>{dayjs(showDate).format("DD. MMMM YYYY").toString()}</td>
            )}
            {isGuest ? <td /> : <td>{showTitle}</td>}
            <td>{seat}</td>
            <td>{guestFirstName}</td>
            <td>{guestSurname}</td>
            {!isGuest ? (
              <Button
                onClick={(event) => handleDeleteReservation(event, showDate)}
                variant="default"
                size="xs"
              >
                Stornieren
              </Button>
            ) : null}
          </tr>
        ),
      ),
    );
  }, [tableElements]);

  return (
    <Box>
      <Title fz="xl" mt="5rem" mb="1rem">
        Meine Reservierungen
      </Title>
      <Table>
        <thead>
          <tr>
            <th>Datum</th>
            <th>Film</th>
            <th>Platz</th>
            <th>Vorname</th>
            <th>Nachname</th>
          </tr>
        </thead>
        <tbody>{tableRows}</tbody>
      </Table>
    </Box>
  );
};

export default ReservationOverview;

import { useRouter } from "next/router";
// mantine
import { Text, Button } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { modals } from "@mantine/modals";
// dayjs
import dayjs from "../../dayjs.config";
// api
import { deleteReservation } from "../../api/deleteReservation";
// components
import { Trash } from "lucide-react";
// types
import type { ReservationWithShow, Show } from "~/lib/general.types";
import { useMediaQuery } from "@mantine/hooks";

interface ReservationElement {
  show: Show;
  reservations: ReservationWithShow[];
  reservation: ReservationWithShow;
}

const ReservationElement = ({
  show: { date, movie_title },
  reservations,
  reservation,
}: ReservationElement) => {
  const router = useRouter();
  // mantine
  const isBreakpointSM = useMediaQuery("(max-width: 48rem)");

  const cancelReservation = ({ show: { id } }: ReservationWithShow) => {
    modals.openConfirmModal({
      title: "Stornierung",
      centered: true,
      children: (
        <Text size="sm">Solle(n) die Reservierungen storniert werden?</Text>
      ),
      labels: { confirm: "Ja", cancel: "Nein" },
      cancelProps: isBreakpointSM
        ? { w: "20%", size: "xs" }
        : { w: "15%", size: "xs" },
      confirmProps: isBreakpointSM
        ? { w: "20%", size: "xs", color: "red" }
        : { w: "15%", size: "xs", color: "red" },
      // cancellation rejected
      onCancel: () => {
        return;
      },

      // cancellation confirmed
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
    <tr style={isBreakpointSM ? { height: "8rem" } : { height: "5rem" }}>
      <td>{dayjs(date).format("DD. MMMM YYYY").toString()}</td>
      <td>{movie_title}</td>
      <td>
        {reservations
          ?.map((reservation: ReservationWithShow) =>
            reservation.show.date === date ? reservation.seat : null,
          )
          .filter((reservation) => reservation !== null)
          .join(", ")}
      </td>
      <td>
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
        style={
          isBreakpointSM
            ? {
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
                height: "inherit",
              }
            : {
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-end",
                height: "inherit",
              }
        }
      >
        <Button
          color="red"
          leftIcon={<Trash size="1rem" />}
          variant="outline"
          size="xs"
          onClick={() => {
            cancelReservation(reservation);
          }}
        >
          Stornieren
        </Button>
      </td>
    </tr>
  );
};

export default ReservationElement;

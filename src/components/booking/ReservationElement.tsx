import { useRouter } from "next/router";
// mantine
import { Text, Button } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { modals } from "@mantine/modals";
import { useMediaQuery } from "@mantine/hooks";
// dayjs
import dayjs from "../../dayjs.config";
// api
import { deleteReservation } from "../../api/deleteReservation";
// locales
import translations from "../../../public/locale/translations";
// components
import { Trash } from "lucide-react";
// types
import type { Locale, ReservationWithShow, Show } from "~/lib/general.types";

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
  const { asPath, replace, locale } = useRouter();
  const isBreakpointSM = useMediaQuery("(max-width: 48rem)");

  //  Fetch component content for default language
  const {
    reservationElement: { cancellation, button },
  } = translations[locale as Locale];

  const cancelReservation = ({ show: { id } }: ReservationWithShow) => {
    modals.openConfirmModal({
      title: "Stornierung",
      centered: true,
      children: <Text size="sm">{cancellation.securityQuestion}</Text>,
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
            void replace(asPath);
            notifications.show({
              title: cancellation.confirmNotification.title,
              message: cancellation.confirmNotification.message,
              color: "green",
            });
          })
          .catch((err: Error) => {
            console.log("Fehler:", err);
            notifications.show({
              title: cancellation.errorNotification.title,
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
          {button.cancel}
        </Button>
      </td>
    </tr>
  );
};

export default ReservationElement;

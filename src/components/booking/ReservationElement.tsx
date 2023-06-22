import { Button } from "@mantine/core";
// dayjs
import dayjs from "../../dayjs.config";
// components
import { Trash } from "lucide-react";
// types
import type { ReservationWithShow, Show } from "~/lib/general.types";

interface ReservationElement {
  show: Show;
  reservations: ReservationWithShow[];
  reservation: ReservationWithShow;
  cancelReservation: (reservation: ReservationWithShow) => void;
}

const ReservationElement = ({
  show: { date, movie_title },
  reservations,
  reservation,
  cancelReservation,
}: ReservationElement) => {
  return (
    <tr key={reservation.id}>
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
  );
};

export default ReservationElement;

import { useEffect, useState } from "react";
// zustand
import { useCinemaStore, selectReservations } from "../../hooks/useCinemaStore";
// mantine
import { Box, Text, Table } from "@mantine/core";
// dayjs
import dayjs from "dayjs";
// types
import type { ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import type { ReservationWithShow } from "~/lib/general.types";

interface ReservationOverviewProps {
  user: object;
}

interface TableElement {
  showDate: string;
  showTitle: string;
  seat: number;
  guest: string;
  guestFirstName: string | null;
  guestSurname: string | null;
}

const ReservationOverview = ({ user }: ReservationOverviewProps) => {
  const [userReservations, setUserReservations] = useState<
    ReservationWithShow[]
  >([]);
  const [tableElements, setTableElements] = useState<TableElement[]>([]);
  const [tableRows, setTableRows] = useState<ReactNode[]>([]);
  const reservations = useCinemaStore(selectReservations);

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
              guest: is_guest ? "ja" : "nein",
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
    setTableRows(
      tableElements.map(
        (
          { showDate, showTitle, seat, guest, guestFirstName, guestSurname },
          index,
        ) => (
          <tr key={index.toString()}>
            <td>{dayjs(showDate).format("DD. MMMM YYYY").toString()}</td>
            <td>{showTitle}</td>
            <td>{seat}</td>
            <td>{guest}</td>
            <td>{guestFirstName}</td>
            <td>{guestSurname}</td>
          </tr>
        ),
      ),
    );
  }, [tableElements]);

  return (
    <Box>
      <Text fz="lg" mb="1rem">
        Meine Reservierungen
      </Text>
      <Table>
        <thead>
          <tr>
            <th>Datum</th>
            <th>Film</th>
            <th>Platz</th>
            <th>Gast</th>
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

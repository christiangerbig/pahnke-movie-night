import { useRouter } from "next/router";
// mantine
import { Card, Table } from "@mantine/core";
// dayjs
import dayjs from "../../dayjs.config";
// locales
import translations from "../../../public/locale/translations";
// types
import type { Database } from "~/lib/database.types";
import type { Locale } from "~/lib/general.types";

interface ShowsTableProps {
  shows: Database["public"]["Tables"]["shows"]["Row"][];
}

const ShowsArchiv = ({ shows }: ShowsTableProps) => {
  const { locale } = useRouter();

  // Fetch component content for default language
  const { showsArchiv } = translations[locale as Locale];

  return (
    <Card bg="dark.9">
      <Table>
        <thead>
          <tr>
            <th>{showsArchiv.table.header.date.text}</th>
            <th>{showsArchiv.table.header.time.text}</th>
            <th>{showsArchiv.table.header.film.text}</th>
            <th>{showsArchiv.table.header.guests.text}</th>
          </tr>
        </thead>
        <tbody>
          {shows.map(({ id, date, time, movie_title, reservations }) => (
            <tr key={id}>
              <td>{dayjs(date).format("DD. MMMM YYYY")}</td>
              <td>{time?.slice(0, 5)}</td>
              <td>{movie_title}</td>
              <td>{reservations.length}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Card>
  );
};

export default ShowsArchiv;

// mantine
import { Card, Table } from "@mantine/core";
// dayjs
import dayjs from "../../dayjs.config";
// types
import type { Database } from "~/lib/database.types";

interface ShowsTableProps {
  shows: Database["public"]["Tables"]["shows"]["Row"][];
}

const ShowsArchiv = ({ shows }: ShowsTableProps) => {
  return (
    <Card bg="dark.9">
      <Table>
        <thead>
          <tr>
            <th>Datum</th>
            <th>Uhrzeit</th>
            <th>Filmtitel</th>
            <th>Besucher</th>
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

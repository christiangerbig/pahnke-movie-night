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
            <th>Filmtitel</th>
            <th>Besucher</th>
          </tr>
        </thead>
        <tbody>
          {shows.map(({ id, date, movie_title }) => (
            <tr key={id}>
              <td>{dayjs(date).format("DD. MMMM YYYY")}</td>
              <td>{movie_title}</td>
              <td>2</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Card>
  );
};

export default ShowsArchiv;

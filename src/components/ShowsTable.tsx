// mantine
import { Table } from "@mantine/core";
// dayjs
import dayjs from "../dayjs.config";
// types
import type { Database } from "~/lib/database.types";

interface ShowsTableProps {
  shows: Database["public"]["Tables"]["shows"]["Row"][];
}

export const ShowsTable = ({ shows }: ShowsTableProps) => {
  return (
    <Table>
      <thead>
        <tr>
          <th>Datum</th>
          <th>Filmtitel</th>
        </tr>
      </thead>
      <tbody>
        {shows.map((show) => (
          <tr key={show.id}>
            <td>{dayjs(show.date).format("DD MMMM YYYY")}</td>
            <td>{show.movie_title}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

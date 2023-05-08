import { Table } from "@mantine/core";
import dayjs from "dayjs";

import type { Database } from "~/lib/database.types";

interface PropTypes {
  shows: Database["public"]["Tables"]["shows"]["Row"][];
}

export const ShowsTable: React.FC<PropTypes> = ({ shows }) => {
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

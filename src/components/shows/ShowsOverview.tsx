import ShowCard from "./ShowCard";
import type { Database } from "../../lib/database.types";

interface ShowsTableProps {
  shows: Database["public"]["Tables"]["shows"]["Row"][];
}

const ShowsOverview: React.FC<ShowsTableProps> = ({ shows }) => {
  return (
    <>
      {shows.map(
        (show): JSX.Element => (
          <ShowCard key={show.id} show={show} />
        ),
      )}
    </>
  );
};

export default ShowsOverview;

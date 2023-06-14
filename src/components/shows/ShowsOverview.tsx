// zustand
import { useCinemaStore, selectShows } from "../../hooks/useCinemaStore";
// mantine
import { Title } from "@mantine/core";
// components
import ShowCard from "./ShowCard";

const ShowsOverview = () => {
  const shows = useCinemaStore(selectShows);

  return (
    <>
      <Title mb="2rem">Shows</Title>
      {shows.map(
        (show): JSX.Element => (
          <ShowCard key={show.id} show={show} />
        ),
      )}
    </>
  );
};

export default ShowsOverview;

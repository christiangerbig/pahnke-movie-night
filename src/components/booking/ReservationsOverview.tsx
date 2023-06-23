// mantine
import { Box, Table, Text, Title, Card } from "@mantine/core";
// components
import ReservationElement from "./ReservationElement";
// types
import type { ReservationWithShow } from "~/lib/general.types";

interface ReservationOverviewProps {
  reservations: ReservationWithShow[];
}

const ReservationOverview = ({ reservations }: ReservationOverviewProps) => {
  return (
    <>
      <Box my="4.5rem">
        <Title order={2} size="h2">
          🍿 Meine Reservierungen
        </Title>
        <Card bg="dark.9" pt={0} mt="xl" withBorder>
          {reservations?.length === 0 ? (
            <Text mt="md" w="full" align="center">
              😔 Keine Reservierungen gefunden
            </Text>
          ) : (
            <Table fontSize="md" verticalSpacing="md" highlightOnHover>
              <thead>
                <tr>
                  <th>Datum</th>
                  <th>Film</th>
                  <th>Platz</th>
                  <th>Gast</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {reservations?.map((reservation) => {
                  const { is_guest, show } = reservation;
                  return (
                    !is_guest && (
                      <ReservationElement
                        key={reservation.id}
                        show={show}
                        reservations={reservations}
                        reservation={reservation}
                      />
                    )
                  );
                })}
              </tbody>
            </Table>
          )}
        </Card>
      </Box>
    </>
  );
};

export default ReservationOverview;

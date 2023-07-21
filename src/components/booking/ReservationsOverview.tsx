import { useRouter } from "next/router";
// mantine
import { Box, Table, Text, Title, Card } from "@mantine/core";
// locales
import translations from "../../../public/locale/translations";
// components
import ReservationElement from "./ReservationElement";
// types
import type { ReservationWithShow, Locale } from "~/lib/general.types";

interface ReservationOverviewProps {
  reservations: ReservationWithShow[];
}

const ReservationOverview = ({ reservations }: ReservationOverviewProps) => {
  const { locale } = useRouter();

  //  Fetch component content for default language
  const {
    reservationOverview: { title, text, table },
  } = translations[locale as Locale];

  return (
    <>
      <Box my="4.5rem">
        <Title order={2} size="h2">
          🍿 {title}
        </Title>
        <Card bg="dark.9" pt={0} mt="xl" withBorder>
          {reservations?.length === 0 ? (
            <Text mt="md" w="full" align="center">
              😔 {text}
            </Text>
          ) : (
            <Table fontSize="md" verticalSpacing="md" highlightOnHover>
              <thead>
                <tr>
                  <th>{table.header.date}</th>
                  <th>{table.header.film}</th>
                  <th>{table.header.seats}</th>
                  <th>{table.header.guest}</th>
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

import type { Database } from "~/lib/database.types";

export type Show = Database["public"]["Tables"]["shows"]["Row"];
export type Reservation = Database["public"]["Tables"]["reservations"]["Row"];
export type ReservationWithShow = Reservation & { show: Show };
export type Locale = "de-DE" | "en-US";

export interface StorageData {
  path: string;
}

// export interface Translation {
//   loginPage: {
//     title: string;
//   };

//   dashboardPage: {
//     title: string;
//   };

//   homePage: {
//     title: string;
//     legend: {
//       freeSeats: string;
//       selectedSeats: string;
//       occupiedSeats: string;
//     };
//     logo: {
//       title: string;
//     };
//   };

//   adminPage: {
//     title: string;
//   };

//   navigationBar: {
//     text: string;
//     button: {
//       admin: string;
//       language: string;
//       logout: string;
//     };
//   };

//   reservationDisplay: {
//     selectedSeats: string;
//   };

//   reservationForm: {
//     schemaTexts: {
//       show: {
//         requirements: {
//           Message: string;
//         };
//       };
//       guestFirstName: {
//         requirements: {
//           Message1: string;
//           Message2: string;
//         };
//       };
//       guestSurName: {
//         requirements: {
//           Message1: string;
//           Message2: string;
//         };
//       };
//     };
//     preselection: {
//       selectShow: {
//         placeholder: string;
//       };
//       checkBoxGuest: {
//         label: string;
//       };
//       guest: {
//         firstName: {
//           label: string;
//           placeholder: string;
//         };
//         surname: {
//           label: string;
//           placeholder: string;
//         };
//       };
//     };
//     booking: {
//       invalid: {
//         errorNotification: {
//           title: string;
//           message: string;
//         };
//       };
//       doublet: {
//         errorNotification: {
//           title: string;
//           message: string;
//         };
//       };
//       correct: {
//         confirmNotification: {
//           message: string;
//           errorMessage: string;
//         };
//       };
//       errorMessage1: string;
//       errorMessage2: string;
//     };
//     button: {
//       submit: string;
//     };
//   };

//   reservationElement: {
//     cancellation: {
//       securityQuestion: string;
//       confirmNotification: {
//         title: string;
//         message: string;
//       };
//       errorNotification: {
//         title: string;
//       };
//     };
//     button: {
//       cancel: string;
//     };
//   };

//   reservationOverview: {
//     myReservations: string;
//     noReservationsFound: string;
//     table: {
//       header: {
//         date: string;
//         film: string;
//         seats: string;
//         guest: string;
//       };
//     };
//   };

//   // layout: {
//   //   selectShow: string;
//   // };

//   // showAddForm: {
//   //   schema: {
//   //     time: {
//   //       requirements: {
//   //         message: string;
//   //       };
//   //     };
//   //     title: {
//   //       requirements: {
//   //         message: string;
//   //       };
//   //     };
//   //     link: {
//   //       requirements: {
//   //         message1: string;
//   //         message2: string;
//   //       };
//   //     };
//   //     poster: {
//   //       requirements: {
//   //         message: string;
//   //       };
//   //     };
//   //   };
//   //   storage: {
//   //     doublet: {
//   //       errorNotification: {
//   //         title: string;
//   //         message: string;
//   //       };
//   //     };
//   //     unknownError: {
//   //       errorNotification: {
//   //         title: string;
//   //       };
//   //     };
//   //   };
//   //   addMovie: {
//   //     errorNotification: {
//   //       title: string;
//   //     };
//   //     confirmNotification: {
//   //       title: string;
//   //       message: string;
//   //     };
//   //     form: {
//   //       date: {
//   //         label: string;
//   //       };
//   //       time: {
//   //         label: string;
//   //       };
//   //       title: {
//   //         label: string;
//   //         placeholder: string;
//   //       };
//   //       link: {
//   //         label: string;
//   //         placeholder: string;
//   //       };
//   //       image: {
//   //         message1: string;
//   //         message2: string;
//   //       };
//   //     };
//   //   };
//   // };

//   // showCard: {
//   //   date: string;
//   //   time: string;
//   //   button: {
//   //     bookSeats: string;
//   //   };
//   // };

//   // showsArchive: {
//   //   table: {
//   //     header: {
//   //       date: string;
//   //       time: string;
//   //       film: string;
//   //       guests: string;
//   //     };
//   //   };
//   // };
// }

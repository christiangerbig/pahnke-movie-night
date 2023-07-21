const translation = {
  "de-DE": {
    loginPage: {
      title: "Willkommen",
      logo: {
        text: "Powered by",
      },
      button: {
        submit: "Einloggen",
      },
    },

    verifyRequestPage: {
      title: "Movie Night",
      text: "Eine E-mail mit einem Bestätigungslink wurde an dein Postfach gesendet.",
    },

    dashboardPage: {
      title: "Dashboard",
    },

    homePage: {
      title: "Kinosaal",
      legend: {
        freeSeats: "Freie Plätze",
        selectedSeats: "Ausgewählte Plätze",
        occupiedSeats: "Belegte Plätze",
      },
      logo: {
        title: "Powered by",
      },
    },

    adminPage: {
      title: "Archiv",
      modal: {
        title: "Neue Show hinzufügen",
      },
      button: {
        addShow: "Show hinzufügen",
      },
    },

    navigationBar: {
      text: "Moin",
      button: {
        admin: "Admin-Bereich",
        language: "Englisch",
        logout: "Logout",
      },
    },

    reservationDisplay: {
      text: "Ausgewählte Plätze: ",
    },

    reservationForm: {
      schemaTexts: {
        show: {
          requirements: {
            Message: "Bitte eine Show auswählen",
          },
        },
        guestFirstName: {
          requirements: {
            message1: "Mindestens 2 Zeichen",
            message2: "Bitte einen Vornamen angeben",
          },
        },
        guestSurname: {
          requirements: {
            message1: "Mindestens 2 Zeichen",
            message2: "Bitte einen Nachnamen angeben",
          },
        },
      },
      preselection: {
        selectShow: {
          placeholder: "Wähle eine Show aus...",
        },
        checkBoxGuest: {
          label: "Ich möchte einen Gast mitbringen",
        },
        guest: {
          firstName: {
            label: "Vorname Gast",
            placeholder: "Vorname",
          },
          surname: {
            label: "Nachname Gast",
            placeholder: "Nachname",
          },
        },
      },
      booking: {
        invalid: {
          errorNotification: {
            title: "Ungültige Reservierung!",
            message: "Bitte noch einen Platz für den Gast angeben.",
          },
        },
        doublet: {
          errorNotification: {
            title: "Doppelte Reservierung!",
            message: "Nur eine Buchung pro Vorstellung möglich.",
          },
        },
        correct: {
          confirmNotification: {
            message: "Buchung erfolgreich.",
            errorMessage: "Es ist ein Fehler aufgetreten.",
          },
        },
        errorMessage1: "Fehler beim Laden der Reservierungen ",
        errorMessage2: "Fehler beim Reservieren ",
      },
      button: {
        submit: "Ticket(s) buchen",
      },
    },

    reservationElement: {
      cancellation: {
        securityQuestion: "Solle(n) die Reservierungen storniert werden?",
        confirmNotification: {
          title: "Stornierung erfolgreich",
          message: "Reservierung wurde storniert!",
        },
        errorNotification: {
          title: "Ups, ein Fehler ist aufgetreten!",
        },
      },
      button: {
        cancel: "Stornieren",
      },
    },

    reservationOverview: {
      title: "Meine Reservierungen",
      text: "Keine Reservierungen gefunden",
      table: {
        header: {
          date: "Datum",
          film: "Film",
          seats: "Platz",
          guest: "Gast",
        },
      },
    },

    seat: {
      tooltip: {
        text: "Platznummer:",
      },
    },

    showAddForm: {
      schemaTexts: {
        time: {
          requirements: {
            message: "Es muss eine Uhzeit angegeben werden",
          },
        },
        title: {
          requirements: {
            message: "Es muss ein Filmtitel angegeben werden",
          },
        },
        link: {
          requirements: {
            message1: "Es muss ein geteilter Youtube-Link angegeben werden",
            message2: "Es muss sich um einen geteilten Youtube-Link handeln",
          },
        },
        poster: {
          requirements: {
            message: "Ein Bild muss hochgeladen werden",
          },
        },
      },
      storage: {
        doublet: {
          errorNotification: {
            title: "Ups ...",
            message: "Das Bild exisitert bereits unter diesem Namen.",
          },
        },
        unknownError: {
          errorNotification: {
            title: "Ups ...",
          },
        },
      },
      addMovie: {
        errorNotification: {
          title: "Ups ...",
        },
        confirmNotification: {
          title: "Yeah!",
          message: "Show wurde hinzugefügt",
        },
      },
      preselection: {
        date: {
          label: "Datum",
        },
        time: {
          label: "Uhzeit",
        },
        title: {
          label: "Filmtitel",
          placeholder: "Titel ...",
        },
        link: {
          label: "You tube link",
          placeholder: "Link ...",
        },
        image: {
          text: "Drag 'n' drop oder klicke um ein Bild auszuwählen",
          errorMessage: "Das Bild darf nicht größer als 5MB sein",
        },
      },
    },

    showCard: {
      date: {
        text: "Datum",
      },
      time: {
        text: "Uhrzeit",
      },
      button: {
        book: "Plätze buchen",
      },
    },

    showsArchiv: {
      table: {
        header: {
          date: {
            text: "Datum",
          },
          time: {
            text: "Uhrzeit",
          },
          film: {
            text: "Filmtitel",
          },
          guests: {
            text: "Besucher",
          },
        },
      },
    },

    layout: {
      text: "Vorstellung wählen",
    },
  },
};

export default translation;

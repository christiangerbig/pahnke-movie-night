const translation = {
  "en-US": {
    loginPage: {
      title: "Welcome",
      button: {
        submit: "Log in",
      },
    },

    verifyRequestPage: {
      title: "Movie Night",
      text: "An email with a confirmation link has been sent to your inbox.",
    },

    dashboardPage: {
      title: "Dashboard",
    },

    homePage: {
      title: "Cinema hall",
      legend: {
        freeSeats: "Free seats",
        selectedSeats: "Selected seats",
        occupiedSeats: "Occupied seats",
      },
    },

    adminPage: {
      title: "Archive",
      modal: {
        title: "Add new show",
      },
      button: {
        addShow: "Add show",
      },
    },

    navigationBar: {
      text: "Hi",
      button: {
        admin: "Admin area",
        language: "German",
        logout: "Logout",
      },
    },

    reservationDisplay: {
      text: "Selected seats: ",
    },

    reservationForm: {
      schemaTexts: {
        show: {
          requirements: {
            message: "Select a show",
          },
        },
        guestFirstName: {
          requirements: {
            message1: "Minimum 2 characters",
            message2: "Please type in  a first name",
          },
        },
        guestSurname: {
          requirements: {
            message1: "Minimum 2 characters",
            message2: "Please type in a surname",
          },
        },
      },
      preselection: {
        selectShow: {
          placeholder: "Select a show...",
        },
        checkBoxGuest: {
          label: "I would like to bring a guest",
        },
        guest: {
          firstName: {
            label: "First name gueast",
            placeholder: "First name",
          },
          surname: {
            label: "Surname guest",
            placeholder: "surname",
          },
        },
      },
      booking: {
        invalid: {
          errorNotification: {
            title: "Invalid reservation!",
            message: "Please specify a seat for the guest.",
          },
        },
        doublet: {
          errorNotification: {
            title: "Double reservation!",
            message: "Only one booking per show possible.",
          },
        },
        correct: {
          confirmNotification: {
            message: "Booking successful.",
            errorMessage: "There has been an error.",
          },
        },
        errorMessage1: "Error loading reservations ",
        errorMessage2: "Reservation error ",
      },
      button: {
        submit: "Book ticket(s)",
      },
    },

    reservationElement: {
      cancellation: {
        securityQuestion: "Should the reservation(s) be cancelled?",
        confirmNotification: {
          title: "Cancellation successful",
          message: "Reservation has been cancelled!",
        },
        errorNotification: {
          title: "Oops, an error has occurred!",
        },
      },
      button: {
        cancel: "Cancel",
      },
    },

    reservationOverview: {
      title: "My reservations",
      text: "No reservations found",
      table: {
        header: {
          date: "Date",
          film: "Film",
          seats: "Seat",
          guest: "Guest",
        },
      },
    },

    seat: {
      tooltip: {
        text: "Seat number:",
      },
    },

    showAddForm: {
      schemaTexts: {
        time: {
          requirements: {
            message: "A time must be specified",
          },
        },
        title: {
          requirements: {
            message: "A film title must be specified",
          },
        },
        link: {
          requirements: {
            message1: "A shared Youtube link must be provided",
            message2: "It must be a shared Youtube link",
          },
        },
        poster: {
          requirements: {
            message: "An image must be uploaded",
          },
        },
      },
      storage: {
        doublet: {
          errorNotification: {
            title: "Oops ...",
            message: "The picture already exists under this name.",
          },
        },
        unknownError: {
          errorNotification: {
            title: "Oops ...",
          },
        },
      },
      addMovie: {
        errorNotification: {
          title: "Oops ...",
        },
        confirmNotification: {
          title: "Yeah!",
          message: "Show has been added",
        },
      },
      preselection: {
        date: {
          label: "Date",
        },
        time: {
          label: "Time",
        },
        title: {
          label: "Film title",
          placeholder: "Title ...",
        },
        link: {
          label: "Youtube link",
          placeholder: "Link ...",
        },
        image: {
          text: "Drag 'n' drop or click to select an image",
          errorMessage: "The image must not be larger than 5MB",
        },
      },
    },

    showCard: {
      date: {
        text: "Date",
      },
      time: {
        text: "Time",
      },
      button: {
        book: "Book seats",
      },
    },

    showsArchive: {
      table: {
        header: {
          date: {
            text: "Date",
          },
          time: {
            text: "Time",
          },
          film: {
            text: "Film title",
          },
          guests: {
            text: "Guest",
          },
        },
      },
    },

    layout: {
      text: "Select show",
    },

    logo: {
      text: "Powered by",
    },
  },
};

export default translation;

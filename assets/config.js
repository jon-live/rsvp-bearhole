/* =============================================================
   EVENT CONFIG  —  edit THIS file for every new party.
   Nothing else needs to change to reuse this site.
   ============================================================= */
window.EVENT_CONFIG = {
  /* ---- The celebration ---------------------------------------- */
  honoree: "Charles",              // the birthday kid (or "Bear & Bunny")
  turningAge: 3,                   // set to null to hide the age line
  tagline: "is turning",           // "is turning {age}!"
  intro: "We'd be over the moon if you'd come celebrate with us!",

  /* ---- When & where ------------------------------------------- */
  date: "Sunday, June 21st, 2026",
  time: "4:00 – 7:00 in the evening",
  location: "1580 Drake Way, Palo Alto, CA",
  locationUrl: "https://www.google.com/maps/search/?api=1&query=1580%20Drake%20Way%2C%20Palo%20Alto%2C%20CA",
  rsvpBy: "Kindly reply by June 18th",

  /* ---- Good things to know (optional rows; blank "" to hide) -- */
  parking: "Street parking available right nearby",
  food: "A proper spread for grown-ups, with kid-friendly favorites too",
  fun: "Games, toys, music, pool access & playgrounds",

  /* ---- A gentle note on gifts (optional; blank "" to hide) --- */
  gifts: "Your presence is the best present! Please don't feel obligated to bring a gift. But if you'd love to give a little something, an Amazon or Target gift card — or a book for the birthday boy — would be wonderful.",

  /* ---- "Add to calendar" (optional) --------------------------
     Fill both to show calendar buttons on the thank-you screen.
     Use 24-hour local time, format: "YYYY-MM-DDTHH:MM:SS".
     Leave either blank ("") to hide the buttons.            */
  calendar: {
    start: "2026-06-21T16:00:00",
    end:   "2026-06-21T19:00:00",
  },

  /* ---- Close RSVPs after a cutoff (optional) -----------------
     Once this moment passes (guest's local time), the form is
     hidden and a polite "RSVPs are closed" notice is shown.
     Leave blank ("") to fall back to the event start time above;
     set to null to never close.                              */
  rsvpDeadline: "",
  closedMessage: "RSVPs are now closed — this celebration has already taken place. Thank you for your love! 💛",

  /* ---- Browser tab title -------------------------------------- */
  pageTitle: "Charles's 3rd Birthday 🎈",

  /* =============================================================
     GOOGLE FORM WIRING
     See README.md → "Connect your Google Form" for how to find
     these values. Until you fill them in, the site still works
     and shows the thank-you screen (it just won't record yet).
     ============================================================= */
  googleForm: {
    // Paste the form's POST url. It ends in /formResponse (NOT /viewform).
    actionUrl: "https://docs.google.com/forms/d/e/1FAIpQLScJ28NWZU9SbZ8uUZBP1jpgWIf3pSmtv5PI6SXTkLaE1kNemg/formResponse",

    // The entry IDs for each question (look like "entry.1234567890").
    fields: {
      name:      "entry.2121458455",
      attending: "entry.194977389",
      guests:    "entry.1121823512",   // the existing "How Many" question (required)
      note:      "entry.1587321885",

      // OPTIONAL — to get adults & kids in their OWN columns, add two more
      // "Short answer" questions to your Google Form (e.g. "Adults" & "Kids")
      // and paste their entry IDs here. Left blank, the site instead writes a
      // readable "2 adults, 1 kid" summary into the "How Many" column above.
      guestsAdults: "",
      guestsKids:   "",
    },

    // These must EXACTLY match the option text in your Google Form's
    // "Can you make it" question (Yes / No / Maybe).
    attendingYes:   "Yes",
    attendingNo:    "No",
    attendingMaybe: "Maybe",
  },
};

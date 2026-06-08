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
  date: "Saturday, July 12th, 2026",
  time: "2:00 – 5:00 in the afternoon",
  location: "The Treehouse Park, 123 Maple Lane",
  locationUrl: "",                 // optional Google Maps link ("" to hide)
  rsvpBy: "Kindly reply by July 5th",

  /* ---- "Add to calendar" (optional) --------------------------
     Fill both to show calendar buttons on the thank-you screen.
     Use 24-hour local time, format: "YYYY-MM-DDTHH:MM:SS".
     Leave either blank ("") to hide the buttons.            */
  calendar: {
    start: "2026-07-12T14:00:00",
    end:   "2026-07-12T17:00:00",
  },

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
      guests:    "entry.1121823512",
      note:      "entry.1587321885",
    },

    // These must EXACTLY match the option text in your Google Form's
    // "Can you make it" question (Yes / No / Maybe).
    attendingYes:   "Yes",
    attendingNo:    "No",
    attendingMaybe: "Maybe",
  },
};

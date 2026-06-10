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
  date: "June 21st, 2026",
  time: "4:00pm (cake cutting at 5:30pm)",
  location: "1580 Drake Way, Palo Alto, CA",
  locationUrl: "https://www.google.com/maps/search/?api=1&query=1580%20Drake%20Way%2C%20Palo%20Alto%2C%20CA",
  rsvpBy: "",

  /* ---- Good things to know (optional rows; blank "" to hide) -- */
  parking: "Street parking available nearby",
  food: "A proper spread for both adults and kids",
  fun: "Games, toys, pool access, sensory play, playgrounds",

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

    // OPTIONAL — paste a Google Apps Script Web App URL here to enable TRUE
    // cross-device editing (each guest updates one clean row, from any device).
    // See apps-script/SETUP.md. Left blank, the site uses the Google Form above
    // plus device-based editing (we remember a guest's reply in their browser).
    appsScriptUrl: "",

    // The entry IDs for each question (look like "entry.1234567890").
    fields: {
      name:      "entry.2121458455",
      attending: "entry.194977389",
      note:      "entry.1587321885",

      // The form has separate "How Many Adultes" and "How Many Kids" questions
      // (both required), so each count goes to its own column.
      guestsAdults: "entry.1121823512",   // "How Many Adultes"
      guestsKids:   "entry.393165136",    // "How Many Kids"

      // No single "how many" question on the form anymore — leave blank.
      guests:    "",
    },

    // These must EXACTLY match the option text in your Google Form's
    // "Can you make it" question (Yes / No / Maybe).
    attendingYes:   "Yes",
    attendingNo:    "No",
    attendingMaybe: "Maybe",
  },
};

/* =============================================================
   EVENT CONFIG  —  edit THIS file for every new party.
   Nothing else needs to change to reuse this site.
   ============================================================= */
window.EVENT_CONFIG = {
  /* ---- The celebration ---------------------------------------- */
  honoree: "Bear",                 // the birthday kid (or "Bear & Bunny")
  turningAge: 5,                   // set to null to hide the age line
  tagline: "is turning",           // "is turning {age}!"
  intro: "We'd be over the moon if you'd come celebrate with us!",

  /* ---- When & where ------------------------------------------- */
  date: "Saturday, July 12th, 2026",
  time: "2:00 – 5:00 in the afternoon",
  location: "The Treehouse Park, 123 Maple Lane",
  locationUrl: "",                 // optional Google Maps link ("" to hide)
  rsvpBy: "Kindly reply by July 5th",

  /* ---- Browser tab title -------------------------------------- */
  pageTitle: "Bear's Birthday 🎈",

  /* =============================================================
     GOOGLE FORM WIRING
     See README.md → "Connect your Google Form" for how to find
     these values. Until you fill them in, the site still works
     and shows the thank-you screen (it just won't record yet).
     ============================================================= */
  googleForm: {
    // Paste the form's POST url. It ends in /formResponse (NOT /viewform).
    actionUrl: "",  // e.g. "https://docs.google.com/forms/d/e/1FAIpQL.../formResponse"

    // The entry IDs for each question (look like "entry.1234567890").
    fields: {
      name:      "",   // "entry.XXXXXXXXXX"
      attending: "",   // "entry.XXXXXXXXXX"
      guests:    "",   // "entry.XXXXXXXXXX"
      note:      "",   // "entry.XXXXXXXXXX"
    },

    // Must EXACTLY match the option text in your Google Form's
    // attending multiple-choice question.
    attendingYes: "Yes, we'll be there! 🎉",
    attendingNo:  "So sorry, we can't make it",
  },
};

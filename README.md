# 🎈 Birthday RSVP

A warm, whimsical RSVP page for kids' birthdays (and any future event).
Guests fill out a lovely form on **your** site; their answers are quietly
recorded into a **Google Sheet** behind the scenes — they never see Google.

- ✨ Elegant, playful design (floating balloons + confetti on submit)
- 🔁 **Reusable** — change one file (`assets/config.js`) for the next party
- 📊 RSVPs land in a Google Sheet you own and control
- 🆓 Free static site, hosts on GitHub Pages — no server, no database

---

## 📁 What's here

```
index.html          the page
assets/config.js    ← EDIT THIS per event (names, date, Google Form wiring)
assets/styles.css   the look & feel
assets/app.js       the behaviour (don't need to touch)
.nojekyll           tells GitHub Pages to serve assets/ as-is
```

---

## 1. Preview it locally (no setup needed)

From this folder:

```bash
python3 -m http.server 8000
```

Open <http://localhost:8000>. Submitting works in **preview mode** right away —
it shows the thank-you screen and logs the RSVP to the browser console
(open DevTools → Console). Wire up Google next so RSVPs are actually saved.

---

## 2. Create your Google Form

1. Go to <https://forms.google.com> → **Blank form**.
2. Add **exactly these four questions** (order doesn't matter):
   | Question (you can rename the text) | Type | Notes |
   |---|---|---|
   | Your name | **Short answer** | |
   | Can you make it? | **Multiple choice** | add two options — see step 4 |
   | How many of you are coming? | **Short answer** | |
   | A note for us | **Paragraph** | |
3. Click the **Responses** tab → green Sheets icon → **Link to Sheets**.
   This is where every RSVP will appear. ✅

---

## 3. Find the field IDs (`entry.XXXXXXXXXX`)

1. Click the **⋮** menu (top right) → **Get pre-filled link**.
2. Type a sample answer in every question, then click **Get link** → **Copy link**.
3. Paste that link somewhere you can read it. It looks like:
   ```
   https://docs.google.com/forms/d/e/1FAIpQLSxxxx/viewform?usp=pp_url
     &entry.111111=Sample+name
     &entry.222222=Yes
     &entry.333333=2
     &entry.444444=Sample+note
   ```
4. Each `entry.NNNNNN` is the ID for the question whose sample answer follows it.
   Note which is which (name / attending / guests / note).

**Your POST url** is that link with `viewform?...` replaced by `formResponse`:
```
https://docs.google.com/forms/d/e/1FAIpQLSxxxx/formResponse
```

---

## 4. Wire it up in `assets/config.js`

Fill in the event details and the `googleForm` block:

```js
googleForm: {
  actionUrl: "https://docs.google.com/forms/d/e/1FAIpQLSxxxx/formResponse",
  fields: {
    name:      "entry.111111",
    attending: "entry.222222",
    guests:    "entry.333333",
    note:      "entry.444444",
  },
  // ⚠️ These two strings must match your form's multiple-choice options EXACTLY.
  attendingYes: "Yes, we'll be there! 🎉",
  attendingNo:  "So sorry, we can't make it",
},
```

> **Important:** In your Google Form's "Can you make it?" question, the two
> options must read *exactly* the same as `attendingYes` / `attendingNo` above
> (emoji and all), or Google will reject those answers.

Reload your local preview and submit a test — it should now show up in your
Google Sheet within a few seconds. 🎉

---

## 5. Publish on GitHub Pages

1. Create a repo (e.g. `rsvp-bearhole`) and push these files:
   ```bash
   git init
   git add .
   git commit -m "Birthday RSVP site"
   git branch -M main
   git remote add origin https://github.com/<you>/rsvp-bearhole.git
   git push -u origin main
   ```
2. On GitHub: **Settings → Pages → Build and deployment**.
   - Source: **Deploy from a branch**
   - Branch: **main** / folder: **/ (root)** → **Save**
3. Wait ~1 minute. Your invite is live at:
   ```
   https://<you>.github.io/rsvp-bearhole/
   ```
   Share that link with your guests!

---

## ♻️ Reusing for the next event

Just edit `assets/config.js`:
- update the names, date, time, place, intro
- make a **new Google Form** + linked Sheet, and paste in the new
  `actionUrl` + `entry` IDs

Commit & push — GitHub Pages redeploys automatically. That's it. 💛

---

## 🗓️ "Add to calendar" buttons

On the thank-you screen, guests who are coming get **Google Calendar** and
**Apple/Outlook (.ics)** buttons. Control them in `assets/config.js`:

```js
calendar: {
  start: "2026-07-12T14:00:00",   // 24-hour local time
  end:   "2026-07-12T17:00:00",
},
```

Leave either value blank (`""`) to hide the buttons.

---

## 🔗 Pretty link previews

When you share the link in a text/WhatsApp/iMessage, a preview card shows.
Because link crawlers don't run JavaScript, edit these **by hand** near the top
of `index.html` (the `og:` and `twitter:` `<meta>` tags) to match your event:

```html
<meta property="og:title" content="Bear is turning 5! 🎈" />
<meta property="og:description" content="Sat July 12 — come celebrate! Tap to RSVP." />
```

To add a preview image, drop a ~1200×630 image in the repo and add:
```html
<meta property="og:image" content="https://jon-live.github.io/rsvp-bearhole/preview.png" />
```

---

## 🎨 Want a different look?

The whole palette lives at the top of `assets/styles.css` under `:root`.
Swap the colors to restyle everything at once.
```
--coral · --teal · --sunshine · --sky · --ink
```

---

## 🔒 A note on privacy

This is a static page; the Google Form URL lives in the page source, so anyone
technical *could* submit to your form directly. For a kids' party that's
totally fine. If you ever need it locked down (private events, gated guest
lists), that calls for a small backend — happy to add one later.

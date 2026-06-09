# Optional upgrade: true cross-device RSVP editing

By default the site works great with your Google Form **plus device-based
editing**: when a guest comes back on the *same phone/browser*, the form is
pre-filled and they can update their reply. (An update lands as a new row in
your sheet — just keep the latest one per person, sorted by timestamp.)

If you'd like **true editing from any device** — where each guest's reply is a
single row that gets overwritten when they change it — switch the backend to a
free Google Apps Script web app. ~5 minutes, one time.

## Steps

1. Open your RSVP **Google Sheet** → **Extensions → Apps Script**.
2. Delete any starter code, then paste in the contents of **`Code.gs`** (in this
   folder). Click **Save** 💾.
3. Click **Deploy → New deployment**.
   - Click the gear ⚙️ → **Web app**.
   - **Execute as:** Me
   - **Who has access:** Anyone
   - **Deploy**, then **Authorize access** (approve the permissions prompt).
4. Copy the **Web app URL** (looks like
   `https://script.google.com/macros/s/AKfy…/exec`).
5. In **`assets/config.js`**, paste it into:
   ```js
   googleForm: {
     appsScriptUrl: "https://script.google.com/macros/s/AKfy…/exec",
     ...
   }
   ```
6. Commit & push. Done — submissions now go to the script, which writes/updates
   one tidy row per guest in a sheet tab called **RSVPs**.

> The site sends each reply as JSON with a stable `rsvpId`. The script upserts
> by that id, so editing a reply overwrites the same row instead of adding a new
> one. You can leave the original Google Form in place or ignore it.

To switch back to the plain Google Form at any time, just blank out
`appsScriptUrl` again.

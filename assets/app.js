/* =============================================================
   RSVP app — reads EVENT_CONFIG, handles the form + confetti.
   No build step, no dependencies. Edit assets/config.js, not this.
   ============================================================= */
(function () {
  "use strict";

  var cfg = window.EVENT_CONFIG || {};
  var $ = function (id) { return document.getElementById(id); };

  /* ---------- 1. Fill the page from config ---------- */
  function text(id, value) {
    var el = $(id);
    if (el && value != null && value !== "") el.textContent = value;
  }

  document.title = cfg.pageTitle || document.title;
  text("honoree", cfg.honoree);
  text("tagline", cfg.tagline);
  text("intro", cfg.intro);
  text("date", cfg.date);
  text("time", cfg.time);
  text("rsvpBy", cfg.rsvpBy);

  // Age line (hide entirely if turningAge is null)
  if (cfg.turningAge == null) {
    var ageLine = $("ageLine");
    if (ageLine) ageLine.style.display = "none";
  } else {
    text("age", cfg.turningAge);
  }

  // Location — link it if a URL was provided
  var locEl = $("location");
  if (locEl && cfg.location) {
    if (cfg.locationUrl) {
      var a = document.createElement("a");
      a.href = cfg.locationUrl;
      a.target = "_blank";
      a.rel = "noopener";
      a.textContent = cfg.location;
      locEl.textContent = "";
      locEl.appendChild(a);
    } else {
      locEl.textContent = cfg.location;
    }
  }

  // Optional "good to know" rows — hide the row if its config value is blank
  [["parking", cfg.parking], ["food", cfg.food], ["fun", cfg.fun]].forEach(function (pair) {
    var el = $(pair[0]);
    if (!el) return;
    var li = el.closest && el.closest("li");
    if (pair[1] == null || pair[1] === "") { if (li) li.hidden = true; return; }
    el.textContent = pair[1];
  });

  var gf = cfg.googleForm || {};
  // Exact text each choice must send to match the Google Form options.
  var attendingMap = {
    yes:   gf.attendingYes   || "Yes",
    no:    gf.attendingNo    || "No",
    maybe: gf.attendingMaybe || "Maybe",
  };

  /* ---------- 1b. "Add to calendar" ---------- */
  var calReady = setupCalendar();
  function setupCalendar() {
    var c = cfg.calendar || {};
    if (!c.start || !c.end) return false;

    var title = (cfg.honoree || "Birthday") +
      (cfg.turningAge != null ? "'s " + ordinal(cfg.turningAge) + " Birthday" : "'s Birthday") + " 🎉";
    var details = cfg.intro || "We can't wait to celebrate with you!";
    var loc = cfg.location || "";
    var start = stampCal(c.start), end = stampCal(c.end);
    if (!start || !end) return false;

    // Google Calendar
    var g = "https://calendar.google.com/calendar/render?action=TEMPLATE" +
      "&text=" + encodeURIComponent(title) +
      "&dates=" + start + "/" + end +
      "&details=" + encodeURIComponent(details) +
      "&location=" + encodeURIComponent(loc);
    $("calGoogle").href = g;

    // Downloadable .ics for Apple Calendar / Outlook
    var ics = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//rsvp//birthday//EN",
      "CALSCALE:GREGORIAN", "BEGIN:VEVENT",
      "UID:" + start + "-" + Math.abs(hash(title)) + "@rsvp",
      "DTSTAMP:" + stampCal(new Date().toISOString()),
      "DTSTART:" + start, "DTEND:" + end,
      "SUMMARY:" + esc(title), "DESCRIPTION:" + esc(details), "LOCATION:" + esc(loc),
      "END:VEVENT", "END:VCALENDAR",
    ].join("\r\n");
    var blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    var icsEl = $("calIcs");
    icsEl.href = URL.createObjectURL(blob);
    icsEl.download = slug(cfg.honoree || "event") + "-birthday.ics";
    return true;
  }
  // "2026-07-12T14:00:00" -> "20260712T140000" (floating local time)
  function stampCal(iso) {
    if (!iso) return "";
    var m = String(iso).match(/(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?/);
    return m ? m[1]+m[2]+m[3]+"T"+m[4]+m[5]+(m[6]||"00") : "";
  }
  function ordinal(n) {
    var s = ["th","st","nd","rd"], v = n % 100;
    return n + (s[(v-20)%10] || s[v] || s[0]);
  }
  function esc(s) { return String(s).replace(/([,;\\])/g, "\\$1").replace(/\n/g, "\\n"); }
  function slug(s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
  function hash(s) { var h = 0; for (var i = 0; i < s.length; i++) h = (h*31 + s.charCodeAt(i))|0; return h; }

  /* ---------- 2. Show/hide guest count based on attendance ---------- */
  var form = $("rsvpForm");
  var guestsField = $("guestsField");
  function syncGuests() {
    var checked = document.querySelector('input[name="attending"]:checked');
    var coming = checked && checked.value !== "no";
    guestsField.classList.toggle("hidden", !coming);
  }
  syncGuests();
  form.addEventListener("change", function (e) {
    if (e.target.name === "attending") syncGuests();
  });

  /* ---------- 2b. Close RSVPs once the event has passed ---------- */
  var closed = isRsvpClosed();
  if (closed) {
    form.hidden = true;
    var notice = $("closedNotice");
    notice.textContent = cfg.closedMessage || "RSVPs are now closed.";
    notice.hidden = false;
  }
  function isRsvpClosed() {
    var deadline = cfg.rsvpDeadline;
    if (deadline === null) return false;                          // never close
    if (!deadline) deadline = cfg.calendar && cfg.calendar.start; // fall back to start time
    if (!deadline) return false;
    var when = new Date(deadline);
    if (isNaN(when.getTime())) return false;
    return new Date() > when;
  }

  /* ---------- 3. Submit ---------- */
  var error = $("error");
  var submitBtn = $("submitBtn");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    hideError();
    if (closed) return; // safety net — form is already hidden when closed

    var name = $("name").value.trim();
    var attendingEl = document.querySelector('input[name="attending"]:checked');
    if (!name) return showError("Please add your name 🙂");
    if (!attendingEl) return showError("Let us know if you can make it!");

    var attending = attendingEl.value; // "yes" | "no" | "maybe"
    var guestsVal = $("guests").value.trim();

    // When coming (yes/maybe), "How Many" is required and must be at least 1.
    if (attending !== "no") {
      if (!guestsVal) return showError("Please tell us how many are coming 🙂");
      if (!(Number(guestsVal) >= 1)) return showError("How many are coming? Please enter a number (1 or more).");
    }

    var payload = {
      name: name,
      attending: attendingMap[attending] || attending,
      // "How Many" is required in the form; send 0 when not coming.
      guests: attending === "no" ? "0" : guestsVal,
      note: $("note").value.trim(),
    };

    submitBtn.disabled = true;
    submitBtn.querySelector(".btn-label").textContent = "Sending…";

    sendToGoogleForm(payload).then(function () {
      celebrate(attending);
    });
  });

  function sendToGoogleForm(payload) {
    var action = gf.actionUrl;
    var fields = gf.fields || {};

    // Not wired up yet → preview mode: still show the thank-you screen.
    if (!action || !fields.name) {
      console.warn(
        "[RSVP] Google Form not configured yet — running in preview mode.\n" +
        "Fill in googleForm.actionUrl and field IDs in assets/config.js.\n" +
        "Captured RSVP:", payload
      );
      return Promise.resolve();
    }

    var body = new URLSearchParams();
    if (fields.name)      body.append(fields.name, payload.name);
    if (fields.attending) body.append(fields.attending, payload.attending);
    if (fields.guests && payload.guests) body.append(fields.guests, payload.guests);
    if (fields.note && payload.note)     body.append(fields.note, payload.note);

    // Google Forms doesn't send CORS headers, so we fire-and-forget.
    // The submission still records; we just can't read the response.
    return fetch(action, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    }).catch(function (err) {
      // Network hiccup — still thank them so the moment stays warm,
      // but log it so you can follow up if needed.
      console.error("[RSVP] submission error:", err, payload);
    });
  }

  function celebrate(status) {
    $("invite").hidden = true;
    $("thanks").hidden = false;

    var copy = {
      yes:   ["🎉", "Hooray — you're on the list!", "Thank you for letting us know. We can't wait to celebrate with you!"],
      maybe: ["🤞", "Fingers crossed!", "Thanks for the heads up — we really hope you can make it. We'll save you a spot just in case! 💛"],
      no:    ["💛", "Thank you for letting us know", "We'll miss you, but we totally understand. Sending a big hug your way!"],
    }[status] || null;
    if (copy) {
      $("thanksEmoji").textContent = copy[0];
      $("thanksTitle").textContent = copy[1];
      $("thanksMsg").textContent = copy[2];
    }
    // Offer "add to calendar" to guests who are coming
    $("calBox").hidden = !(status === "yes" && calReady);
    burstConfetti();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  $("againBtn").addEventListener("click", function () {
    form.reset();
    syncGuests();
    submitBtn.disabled = false;
    submitBtn.querySelector(".btn-label").textContent = "Send my RSVP";
    $("thanks").hidden = true;
    $("invite").hidden = false;
    // restore default thank-you copy for next time
    $("thanksEmoji").textContent = "🎉";
    $("thanksTitle").textContent = "Hooray — you're on the list!";
    $("thanksMsg").textContent = "Thank you for letting us know. We can't wait to celebrate with you!";
  });

  function showError(msg) {
    error.textContent = msg;
    error.hidden = false;
  }
  function hideError() { error.hidden = true; }

  /* ---------- 4. Confetti (tiny canvas implementation) ---------- */
  var canvas = $("confetti");
  var ctx = canvas.getContext("2d");
  var pieces = [];
  var rafId = null;
  var colors = ["#C9A24B", "#E0C883", "#A8843A", "#FBF8F1", "#163D31"];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  function burstConfetti() {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var count = 140;
    for (var i = 0; i < count; i++) {
      pieces.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 80,
        y: canvas.height / 3,
        vx: (Math.random() - 0.5) * 12,
        vy: Math.random() * -14 - 4,
        size: Math.random() * 8 + 5,
        color: colors[(Math.random() * colors.length) | 0],
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.3,
        life: 1,
      });
    }
    if (!rafId) tick();
  }

  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = pieces.length - 1; i >= 0; i--) {
      var p = pieces[i];
      p.vy += 0.35;            // gravity
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.99;
      p.rot += p.vr;
      p.life -= 0.008;

      if (p.y > canvas.height + 40 || p.life <= 0) {
        pieces.splice(i, 1);
        continue;
      }
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      ctx.restore();
    }
    if (pieces.length) {
      rafId = requestAnimationFrame(tick);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      rafId = null;
    }
  }
})();

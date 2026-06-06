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

  // Reflect the friendly yes/no labels from config onto the pills
  var gf = cfg.googleForm || {};
  setPillLabel("yes", gf.attendingYes);
  setPillLabel("no", gf.attendingNo);
  function setPillLabel(value, label) {
    if (!label) return;
    var input = document.querySelector('input[name="attending"][value="' + value + '"]');
    if (input && input.nextElementSibling) input.nextElementSibling.textContent = label;
  }

  /* ---------- 2. Show/hide guest count based on attendance ---------- */
  var form = $("rsvpForm");
  var guestsField = $("guestsField");
  function syncGuests() {
    var checked = document.querySelector('input[name="attending"]:checked');
    var coming = checked && checked.value === "yes";
    guestsField.classList.toggle("hidden", !coming);
  }
  syncGuests();
  form.addEventListener("change", function (e) {
    if (e.target.name === "attending") syncGuests();
  });

  /* ---------- 3. Submit ---------- */
  var error = $("error");
  var submitBtn = $("submitBtn");

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    hideError();

    var name = $("name").value.trim();
    var attendingEl = document.querySelector('input[name="attending"]:checked');
    if (!name) return showError("Please add your name 🙂");
    if (!attendingEl) return showError("Let us know if you can make it!");

    var attending = attendingEl.value; // "yes" | "no"
    var payload = {
      name: name,
      attending: attending === "yes" ? (gf.attendingYes || "Yes")
                                     : (gf.attendingNo || "No"),
      guests: attending === "yes" ? ($("guests").value.trim() || "1") : "",
      note: $("note").value.trim(),
    };

    submitBtn.disabled = true;
    submitBtn.querySelector(".btn-label").textContent = "Sending…";

    sendToGoogleForm(payload).then(function () {
      celebrate(attending === "yes");
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

  function celebrate(coming) {
    $("invite").hidden = true;
    var thanks = $("thanks");
    thanks.hidden = false;

    if (!coming) {
      $("thanksEmoji").textContent = "💛";
      $("thanksTitle").textContent = "Thank you for letting us know";
      $("thanksMsg").textContent = "We'll miss you, but we totally understand. Sending a big hug your way!";
    }
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
  var colors = ["#FF8A65", "#4DB6AC", "#FFD54F", "#F4663B", "#ffffff"];

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

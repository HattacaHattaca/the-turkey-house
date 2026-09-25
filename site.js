/* The Turkey House — plain JavaScript, no libraries. Every feature degrades gracefully:
   if this file fails to load, the pages still read fine, the phone number still works,
   and the menu is still in plain view. */
(function () {
  "use strict";
  var T = window.TH || {}, B = T.business || {}, O = T.orders || {}, M = T.menu || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var money = function (n) { return "$" + n.toFixed(2); };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var store = {
    get: function (k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };

  /* ---------- text bindings (phone, address, hours...) ---------- */
  $$("[data-th]").forEach(function (el) { var v = B[el.getAttribute("data-th")]; if (v != null) el.textContent = v; });
  $$("[data-th-href]").forEach(function (el) {
    var k = el.getAttribute("data-th-href");
    if (k === "tel") el.href = "tel:" + B.phoneDial;
    if (k === "maps") el.href = B.mapsUrl;
    if (k === "sms") el.href = "sms:" + B.phoneDial;
  });
  if (B.healthScore == null) $$(".js-health").forEach(function (e) { e.classList.add("hidden"); });
  $$(".js-year").forEach(function (e) { e.textContent = new Date().getFullYear(); });
  if (B.facebookUrl) { var f = $("#social-fb"); if (f) { f.href = B.facebookUrl; f.classList.remove("hidden"); } }
  if (B.instagramUrl) { var i = $("#social-ig"); if (i) { i.href = B.instagramUrl; i.classList.remove("hidden"); } }
  if (B.reviewUrl) { var r = $("#review-link"); if (r) { r.href = B.reviewUrl; r.classList.remove("hidden"); } }

  /* ---------- open / closed (Durham time, works on any visitor's clock) ---------- */
  var DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  function nowET() {
    var parts = new Intl.DateTimeFormat("en-US", { timeZone: "America/New_York", weekday: "short", hour: "numeric", minute: "numeric", hour12: false }).formatToParts(new Date());
    var o = {}; parts.forEach(function (p) { o[p.type] = p.value; });
    return { day: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(o.weekday), min: (parseInt(o.hour, 10) % 24) * 60 + parseInt(o.minute, 10) };
  }
  var fmtH = function (h) { var s = h >= 12 ? "PM" : "AM"; return ((h + 11) % 12 + 1) + " " + s; };
  function openState() {
    var n = nowET(), h = B.hours || {}, today = h[n.day];
    if (today && n.min >= today[0] * 60 && n.min < today[1] * 60) return { open: true, text: "Open now · until " + fmtH(today[1]) };
    for (var k = 0; k < 8; k++) {
      var d = (n.day + k) % 7, s = h[d];
      if (!s) continue;
      if (k === 0 && n.min >= s[0] * 60) continue;
      return { open: false, text: "Closed · opens " + (k === 0 ? "today" : k === 1 ? "tomorrow" : DAYS[d]) + " at " + fmtH(s[0]) };
    }
    return { open: false, text: "Closed" };
  }
  $$(".js-status").forEach(function (el) {
    var s = openState();
    el.innerHTML = '<span class="dot' + (s.open ? " open" : "") + '"></span>' + esc(s.text);
  });

  /* ---------- testimonials: only real ones, only if you add them ---------- */
  var tRoot = $("#testimonials");
  if (tRoot) {
    if (B.testimonials && B.testimonials.length) {
      $("#testimonial-list").innerHTML = B.testimonials.map(function (t) {
        return '<figure class="card"><blockquote class="quote">“' + esc(t.quote) + '”</blockquote><figcaption>— ' + esc(t.by) + "</figcaption></figure>";
      }).join("");
    } else tRoot.classList.add("hidden");
  }

  /* ---------- sending orders / applications ---------- */
  function send(subject, fields, smsText) {
    if (O.web3formsKey) {
      var body = { access_key: O.web3formsKey, subject: subject, from_name: "The Turkey House Website" };
      Object.keys(fields).forEach(function (k) { body[k] = fields[k]; });
      return fetch("https://api.web3forms.com/submit", {
        method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(body)
      }).then(function (r) { return r.json(); }).then(function (j) {
        if (!j.success) throw new Error(j.message || "send failed");
        return { via: "email" };
      });
    }
    // Fallback that always works: open a pre-filled text message to the truck.
    location.href = "sms:" + B.phoneDial + "?&body=" + encodeURIComponent(smsText);
    return Promise.resolve({ via: "sms" });
  }

  /* ---------- menu + cart (menu.html) ---------- */
  var root = $("#menu-root");
  if (root) {
    var cart = store.get("th_cart") || [];
    var items = M.items;
    var byId = {}; items.forEach(function (x) { byId[x.id] = x; });
    var orderable = function (x) { return x.price != null; };

    var html = '<nav class="cat-nav" aria-label="Menu sections">' + M.categories.map(function (c) { return '<a href="#cat-' + c.id + '">' + esc(c.title) + "</a>"; }).join("") + "</nav>";
    M.categories.forEach(function (c) {
      var list = items.filter(function (x) { return x.cat === c.id; });
      if (!list.length) return;
      html += '<h2 id="cat-' + c.id + '" style="scroll-margin-top:130px">' + esc(c.title) + "</h2>";
      list.forEach(function (x) {
        html += '<article class="item"><h3>' + esc(x.name) + (x.star ? '<span class="badge">CROWD FAVORITE</span>' : "") + "</h3>" +
          '<div class="price">' + (x.price != null ? money(x.price) : "") + "</div>" + (x.desc ? "<p>" + esc(x.desc) + "</p>" : "");
        if (orderable(x)) {
          html += '<div class="row">';
          if (x.combo) {
            html += '<select aria-label="Choose your side for ' + esc(x.name) + '" data-opt="side">' + M.sideChoices.map(function (s) { return "<option>" + esc(s) + "</option>"; }).join("") + "</select>" +
              '<select aria-label="Choose your drink for ' + esc(x.name) + '" data-opt="drink">' + M.drinkChoices.map(function (s) { return "<option>" + esc(s) + "</option>"; }).join("") + "</select>";
          }
          html += '<button class="btn small" type="button" data-add="' + x.id + '">Add to order</button></div>';
        } else html += '<div class="row"><small class="empty">Available at the window</small></div>';
        html += "</article>";
      });
    });
    if (M.comingSoon) html += '<div class="banner" style="margin-top:34px"><div><h3>Coming soon</h3><p><strong>' + esc(M.comingSoon.title) + ".</strong> " + esc(M.comingSoon.text) + "</p></div></div>";
    html += '<p class="empty" style="margin-top:26px">Menu items are made fresh to order. Sodas, tea, lemonade and bottled water are grabbed at the window when you pick up.</p>';
    root.innerHTML = html;

    root.addEventListener("click", function (e) {
      var b = e.target.closest("[data-add]"); if (!b) return;
      var x = byId[b.getAttribute("data-add")], art = b.closest(".item");
      var opts = $$("select[data-opt]", art).map(function (s) { return s.value; }).join(" · ");
      var key = x.id + "|" + opts, line = cart.filter(function (l) { return l.key === key; })[0];
      if (line) line.qty++; else cart.push({ key: key, id: x.id, name: x.name, unit: x.price, qty: 1, opts: opts });
      saveCart(); b.textContent = "Added ✓"; setTimeout(function () { b.textContent = "Add to order"; }, 900);
    });

    var cartEl = $("#cart-lines"), totalsEl = $("#cart-totals"), formEl = $("#order-form");
    function totals() {
      var sub = cart.reduce(function (s, l) { return s + l.unit * l.qty; }, 0), tax = Math.round(sub * (O.taxRate || 0) * 100) / 100;
      return { sub: sub, tax: tax, total: sub + tax };
    }
    function saveCart() { store.set("th_cart", cart); renderCart(); }
    function renderCart() {
      if (!cart.length) {
        cartEl.innerHTML = '<li class="empty" style="display:block">Your order is empty. Tap “Add to order” on anything that looks good.</li>';
        totalsEl.innerHTML = ""; formEl.classList.add("hidden"); return;
      }
      cartEl.innerHTML = cart.map(function (l, n) {
        return "<li><span>" + esc(l.name) + '</span><span class="qty"><button type="button" aria-label="Remove one ' + esc(l.name) + '" data-dec="' + n + '">−</button><b>' + l.qty +
          '</b><button type="button" aria-label="Add one ' + esc(l.name) + '" data-inc="' + n + '">+</button></span>' + (l.opts ? "<small>" + esc(l.opts) + "</small>" : "") + "</li>";
      }).join("");
      var t = totals();
      totalsEl.innerHTML = "<div><span>Subtotal</span><span>" + money(t.sub) + "</span></div>" +
        (t.tax ? "<div><span>Tax</span><span>" + money(t.tax) + "</span></div>" : "") +
        '<div class="grand"><span>Total</span><span>' + money(t.total) + "</span></div>";
      formEl.classList.remove("hidden");
    }
    cartEl.addEventListener("click", function (e) {
      var d = e.target.getAttribute("data-dec"), i = e.target.getAttribute("data-inc");
      if (d != null) { cart[d].qty--; if (cart[d].qty <= 0) cart.splice(d, 1); saveCart(); }
      if (i != null) { cart[i].qty++; saveCart(); }
    });

    /* pickup day/time choices */
    var daySel = $("#pickup-day"), timeSel = $("#pickup-time");
    function buildDays() {
      var n = nowET(), opts = [];
      for (var k = 0; k < 8 && opts.length < 4; k++) {
        var d = (n.day + k) % 7, s = (B.hours || {})[d]; if (!s) continue;
        if (k === 0 && n.min >= s[1] * 60 - 15) continue;
        opts.push({ v: k, label: (k === 0 ? "Today (" + DAYS[d] + ")" : k === 1 ? "Tomorrow (" + DAYS[d] + ")" : DAYS[d]), d: d });
      }
      daySel.innerHTML = opts.map(function (o) { return '<option value="' + o.v + '" data-d="' + o.d + '">' + o.label + "</option>"; }).join("");
      buildTimes();
    }
    function buildTimes() {
      var o = daySel.options[daySel.selectedIndex]; if (!o) return;
      var k = +o.value, s = B.hours[+o.getAttribute("data-d")], n = nowET(), earliest = s[0] * 60, out = [];
      if (k === 0) earliest = Math.max(earliest, Math.ceil((n.min + (O.leadTimeMinutes || 20)) / 15) * 15);
      var openNow = k === 0 && n.min >= s[0] * 60;
      if (openNow) out.push('<option value="ASAP">As soon as it’s ready (about ' + (O.prepMinutes || 15) + " min)</option>");
      for (var m = earliest; m <= s[1] * 60 - 15; m += 15) {
        var h = Math.floor(m / 60), mm = m % 60;
        out.push("<option>" + ((h + 11) % 12 + 1) + ":" + (mm < 10 ? "0" : "") + mm + " " + (h >= 12 ? "PM" : "AM") + "</option>");
      }
      timeSel.innerHTML = out.join("") || "<option value=''>No more times today</option>";
    }
    if (daySel) { buildDays(); daySel.addEventListener("change", buildTimes); }

    /* payment choices */
    var payWrap = $("#pay-choices");
    var hasPay = !!O.payLink;
    payWrap.innerHTML = (hasPay ? '<label class="radio"><input type="radio" name="pay" value="online" checked> <span>Pay online now<br><small class="empty">Secure card payment. Your order is locked in.</small></span></label>' : "") +
      ((!hasPay || O.allowPayAtPickup) ? '<label class="radio"><input type="radio" name="pay" value="pickup"' + (hasPay ? "" : " checked") + '> <span>Pay when I pick up<br><small class="empty">Card or cash at the window.</small></span></label>' : "");

    formEl.addEventListener("submit", function (e) {
      e.preventDefault();
      var fd = new FormData(formEl); if (fd.get("botcheck")) return;
      var t = totals(), code = "TH-" + Math.floor(1000 + Math.random() * 9000);
      var pay = fd.get("pay") || "pickup";
      var pickup = (daySel.options[daySel.selectedIndex].text) + " · " + timeSel.value;
      var lines = cart.map(function (l) { return l.qty + " x " + l.name + (l.opts ? " (" + l.opts + ")" : ""); }).join("\n");
      var car = (fd.get("car") || "").trim();
      var text = "NEW ORDER " + code + "\n" + lines + "\nTotal: " + money(t.total) + "\nPickup: " + pickup +
        "\nName: " + fd.get("name") + "\nPhone: " + fd.get("phone") + (car ? "\nCurbside car: " + car : "") +
        "\nPayment: " + (pay === "online" ? "paying online" : "pay at pickup") + (fd.get("notes") ? "\nNotes: " + fd.get("notes") : "");
      var btn = $("button[type=submit]", formEl), msg = $("#order-msg");
      btn.disabled = true; btn.textContent = "Sending…"; msg.innerHTML = "";
      send("Order " + code + " — " + fd.get("name") + " — " + money(t.total), { order_code: code, name: fd.get("name"), phone: fd.get("phone"), message: text }, text)
        .then(function (r) {
          var payBtn = pay === "online" && hasPay ? '<p><a class="btn" href="' + esc(O.payLink) + '" target="_blank" rel="noopener">' + esc(O.payLinkLabel || "Pay now") + " · " + money(t.total) + '</a><br><small>Enter <b>' + money(t.total) + "</b> and your order code <b>" + code + "</b> at checkout.</small></p>" : "";
          msg.innerHTML = '<div class="success"><strong>' + (r.via === "sms" ? "Almost done — send the text that just opened." : "Order received!") + "</strong><p>Your order code is <b>" + code + "</b>. We’ll text you at " + esc(fd.get("phone")) +
            " if anything changes. Pickup: " + esc(pickup) + ".</p>" + payBtn + '<p style="margin:0">Questions? Call <a href="tel:' + B.phoneDial + '">' + esc(B.phoneDisplay) + "</a>.</p></div>";
          cart = []; saveCart(); formEl.classList.add("hidden"); msg.scrollIntoView({ behavior: "smooth", block: "center" });
        })
        .catch(function () {
          msg.innerHTML = '<div class="error"><strong>We couldn’t send that online.</strong> Nothing was charged. Please <a href="tel:' + B.phoneDial + '">call or text ' + esc(B.phoneDisplay) + "</a> and we’ll take your order right away.</div>";
        })
        .then(function () { btn.disabled = false; btn.textContent = "Place order"; });
    });
    renderCart();
  }

  /* ---------- job application (join.html) ---------- */
  var app = $("#apply-form");
  if (app) {
    var roleSel = $("#role");
    if (roleSel && T.jobs) roleSel.innerHTML = '<option value="">Choose a role…</option>' + T.jobs.openings.map(function (j) { return "<option>" + esc(j.title) + "</option>"; }).join("") + "<option>Not sure — general inquiry</option>";
    var list = $("#openings");
    if (list && T.jobs) list.innerHTML = T.jobs.openings.map(function (j) {
      return '<article class="card"><div class="kicker">' + esc(j.type) + "</div><h3>" + esc(j.title) + "</h3><p>" + esc(j.blurb) + "</p></article>";
    }).join("");
    app.addEventListener("submit", function (e) {
      e.preventDefault();
      var fd = new FormData(app); if (fd.get("botcheck")) return;
      var text = "JOB APPLICATION\nRole: " + fd.get("role") + "\nName: " + fd.get("name") + "\nPhone: " + fd.get("phone") + "\nEmail: " + fd.get("email") +
        "\nAvailability: " + fd.get("availability") + "\nExperience: " + fd.get("experience") + "\nResume link: " + (fd.get("resume") || "none") + "\nAbout: " + fd.get("about");
      var btn = $("button[type=submit]", app), msg = $("#apply-msg");
      btn.disabled = true; btn.textContent = "Sending…";
      send("Job application — " + fd.get("name") + " — " + fd.get("role"),
        { name: fd.get("name"), email: fd.get("email"), phone: fd.get("phone"), role: fd.get("role"), availability: fd.get("availability"), experience: fd.get("experience"), resume_link: fd.get("resume") || "none", about: fd.get("about") }, text)
        .then(function (r) {
          msg.innerHTML = '<div class="success"><strong>' + (r.via === "sms" ? "Send the text that just opened and you’re in." : "Thank you — we got it.") + "</strong> Someone from The Turkey House will reach out. You can also call " + esc(B.phoneDisplay) + ".</div>";
          if (r.via === "email") app.reset();
        })
        .catch(function () { msg.innerHTML = '<div class="error">That didn’t go through. Please call or text <a href="tel:' + B.phoneDial + '">' + esc(B.phoneDisplay) + "</a> instead.</div>"; })
        .then(function () { btn.disabled = false; btn.textContent = "Send my application"; });
    });
  }
})();

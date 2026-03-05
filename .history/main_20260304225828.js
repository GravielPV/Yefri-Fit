/* ============================================================
   ELITE FIT — Main JavaScript
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  /* ── Navbar: glassmorphism on scroll ──────────────────── */
  const navbar = document.getElementById("navbar");
  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 40);
  });

  /* ── Hamburger menu ───────────────────────────────────── */
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");

  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => navLinks.classList.remove("open"));
  });

  /* ── Scroll-reveal animation ──────────────────────────── */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    },
    { threshold: 0.1 },
  );

  const revealSelectors = [
    ".service-card",
    ".price-card",
    ".testimonial-card",
    ".contact-item",
  ];

  document.querySelectorAll(revealSelectors.join(", ")).forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity .5s ease, transform .5s ease";
    revealObserver.observe(el);
  });

  /* ── Animated number counter ──────────────────────────── */
  function animateCounter(el, target) {
    const suffix = el.querySelector(".suffix");
    const suffixHTML = suffix ? suffix.outerHTML : "";
    let current = 0;
    const step = Math.ceil(target / 60);
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.innerHTML = current + suffixHTML;
      if (current >= target) clearInterval(timer);
    }, 25);
  }

  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll(".stat-num").forEach((el) => {
            const raw = el.dataset.count;
            if (raw) animateCounter(el, parseInt(raw, 10));
          });
          statsObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 },
  );

  document
    .querySelectorAll(".hero-stats")
    .forEach((el) => statsObserver.observe(el));

  /* ── Contact form handler removed (no form) ─────────────── */

  /* ── Booking Modal ───────────────────────────────────────── */
  const overlay     = document.getElementById("bookingOverlay");
  const closeBtn    = document.getElementById("bookingClose");
  const bookingForm = document.getElementById("bookingForm");
  const bService    = document.getElementById("b-service");
  const bDate       = document.getElementById("b-date");
  const bTime       = document.getElementById("b-time");
  const bName       = document.getElementById("b-name");

  // Set minimum date to today
  const todayStr = new Date().toISOString().split("T")[0];
  bDate.setAttribute("min", todayStr);

  function openBooking(presetService) {
    if (presetService && bService) {
      const opts = Array.from(bService.options);
      const match = opts.find((o) => o.value === presetService);
      if (match) bService.value = match.value;
    }
    overlay.classList.add("active");
    document.body.style.overflow = "hidden";
    setTimeout(() => bName && bName.focus(), 350);
  }

  function closeBooking() {
    overlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  // Open triggers
  document.querySelectorAll(".open-booking").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      openBooking(el.dataset.service || "");
    });
  });

  // Close: X button, overlay click, Escape key
  closeBtn.addEventListener("click", closeBooking);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeBooking();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeBooking();
  });

  // Validation helper
  function markField(fieldEl, valid) {
    const wrap = fieldEl.closest(".booking-field");
    if (!wrap) return;
    if (valid) {
      wrap.classList.remove("error");
    } else {
      if (!wrap.querySelector(".booking-error")) {
        const err = document.createElement("span");
        err.className = "booking-error";
        err.textContent = "Este campo es requerido";
        wrap.appendChild(err);
      }
      wrap.classList.add("error");
    }
  }

  // Submit → build WhatsApp message
  bookingForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name    = bName.value.trim();
    const service = bService.value;
    const date    = bDate.value;
    const time    = bTime.value;
    const note    = document.getElementById("b-note").value.trim();

    let valid = true;
    markField(bName, !!name);
    markField(bDate, !!date);
    markField(bTime, !!time);
    if (!name || !date || !time) { valid = false; }
    if (!valid) return;

    // Format date nicely in Spanish
    const [y, m, d] = date.split("-");
    const months = ["enero","febrero","marzo","abril","mayo","junio",
                    "julio","agosto","septiembre","octubre","noviembre","diciembre"];
    const dateFmt = `${parseInt(d)} de ${months[parseInt(m) - 1]} de ${y}`;

    let msg  = `Hola Yefri! Me gustaría agendar una cita 📅\n\n`;
    msg     += `👤 *Nombre:* ${name}\n`;
    msg     += `🏋️ *Servicio:* ${service}\n`;
    msg     += `📅 *Fecha:* ${dateFmt}\n`;
    msg     += `🕐 *Hora:* ${time}\n`;
    if (note) msg += `📝 *Nota:* ${note}\n`;
    msg     += `\nQuedo pendiente de tu confirmacion!`;

    const waURL = `https://wa.me/18295483174?text=${encodeURIComponent(msg)}`;
    window.open(waURL, "_blank");
    closeBooking();
    bookingForm.reset();
  });

  /* ── Navbar: highlight active section link ────────────── */
  const sections = document.querySelectorAll("section[id]");
  window.addEventListener("scroll", () => {
    let current = "";
    sections.forEach((sec) => {
      if (window.scrollY >= sec.offsetTop - 120) {
        current = sec.getAttribute("id");
      }
    });
    document.querySelectorAll(".nav-links a").forEach((a) => {
      a.style.color =
        a.getAttribute("href") === `#${current}` ? "var(--accent)" : "";
    });
  });
});

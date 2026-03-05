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
    ".cert-item",
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
    let current = 0;
    const step = Math.ceil(target / 60);
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current;
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

  /* ── Contact form: show toast on submit ───────────────── */
  const contactForm = document.getElementById("contactForm");
  const toast = document.getElementById("toast");

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 3500);
    this.reset();
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

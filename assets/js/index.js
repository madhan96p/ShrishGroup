/* =========================================
   SHRISH GROUP - GLOBAL SCRIPT (every page)
   Scroll behaviour · Off-canvas menu · Cookie consent
   AOS init · Cycling smart CTA
========================================= */

document.addEventListener("DOMContentLoaded", function () {
  /* ---------- 1. AOS (Animate on Scroll) ---------- */
  if (typeof AOS !== "undefined") {
    AOS.init({
      duration: 1000,
      once: true,
      mirror: false,
    });
  }

  /* ---------- 2. "Puma-style" scroll detection ---------- */
  let lastScroll = window.scrollY;

  function onScroll() {
    const header = document.getElementById("siteHeader");
    if (!header) return;

    const current = window.scrollY;

    if (current > 90) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }

    lastScroll = current;
  }

  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- 3. Escape closes the off-canvas menu ---------- */
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      document.body.classList.remove("menu-open");
    }
  });

  /* ---------- 4. Cookie consent ---------- */
  const CONSENT_KEY = "shrish_cookie_consent";

  function initCookieBanner() {
    const banner = document.getElementById("cookieBanner");
    if (!banner) return;

    if (localStorage.getItem(CONSENT_KEY)) return;

    setTimeout(() => banner.classList.add("visible"), 900);

    const close = (value) => {
      localStorage.setItem(CONSENT_KEY, value);
      banner.classList.remove("visible");
    };

    const accept = document.getElementById("cookieAccept");
    const decline = document.getElementById("cookieDecline");
    if (accept) accept.addEventListener("click", () => close("accepted"));
    if (decline) decline.addEventListener("click", () => close("declined"));
  }

  /* ---------- 5. Cycling mobile smart CTA ---------- */
  function initSmartButton() {
    const btn = document.getElementById("smartBtn");
    const label = document.getElementById("smartBtnText");
    if (!btn || !label) return;

    const states = [
      {
        text: "Talk to us",
        href: "contact.html",
        icon: "fa-solid fa-comments",
      },
      {
        text: "Call now",
        href: "tel:+919176500207",
        icon: "fa-solid fa-phone",
      },
      {
        text: "Book a cab",
        href: "https://travels.shrishgroup.com",
        icon: "fa-solid fa-car",
      },
      {
        text: "Build with us",
        href: "https://associates.shrishgroup.com",
        icon: "fa-solid fa-helmet-safety",
      },
    ];

    let i = 0;
    setInterval(() => {
      i = (i + 1) % states.length;
      btn.classList.add("fading");
      setTimeout(() => {
        const state = states[i];
        label.textContent = state.text;
        btn.setAttribute("href", state.href);
        const icon = btn.querySelector("i");
        if (icon) icon.className = state.icon;
        btn.classList.remove("fading");
      }, 320);
    }, 4200);
  }

  /* Components are injected asynchronously - wire up once each arrives. */
  document.addEventListener("component:loaded", (event) => {
    if (event.detail.id === "cookie-placeholder") initCookieBanner();
    if (event.detail.id === "footer-placeholder") initSmartButton();
  });

  // In case components were already present (static fallback)
  initCookieBanner();
  initSmartButton();
  onScroll();
});

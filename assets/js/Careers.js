document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  /* =========================================================
       SETTINGS
       ========================================================= */

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  /* =========================================================
       1. AOS — SCROLL REVEAL
       ========================================================= */

  if (window.AOS) {
    AOS.init({
      duration: reducedMotion ? 0 : 700,
      easing: "ease-out-cubic",
      once: true,
      offset: 80,
      disable: reducedMotion,
    });
  }

  /* =========================================================
       2. MOUSE SPOTLIGHT
       ========================================================= */

  const cards = document.querySelectorAll(".perk-card, .opening-card");

  cards.forEach((card) => {
    card.addEventListener("pointermove", (event) => {
      if (reducedMotion) return;

      const rect = card.getBoundingClientRect();

      const x = event.clientX - rect.left;

      const y = event.clientY - rect.top;

      card.style.setProperty("--mouse-x", `${x}px`);

      card.style.setProperty("--mouse-y", `${y}px`);
    });
  });

  /* =========================================================
       3. MAGNETIC APPLY BUTTONS
       ========================================================= */

  const buttons = document.querySelectorAll(".opening-card .btn-outline");

  buttons.forEach((button) => {
    button.addEventListener("pointermove", (event) => {
      if (reducedMotion) return;

      const rect = button.getBoundingClientRect();

      const x = event.clientX - rect.left - rect.width / 2;

      const y = event.clientY - rect.top - rect.height / 2;

      button.style.transform = `translate(
                        ${x * 0.08}px,
                        ${y * 0.08}px
                    )`;
    });

    button.addEventListener("pointerleave", () => {
      button.style.transform = "";
    });
  });

  /* =========================================================
       4. HERO PARALLAX
       ========================================================= */

  const hero = document.querySelector(".page-banner");

  if (hero && !reducedMotion) {
    let ticking = false;

    window.addEventListener(
      "scroll",
      () => {
        if (ticking) return;

        window.requestAnimationFrame(() => {
          const scroll = window.scrollY;

          if (scroll < hero.offsetHeight) {
            hero.style.setProperty("--hero-shift", `${scroll * 0.08}px`);
          }

          ticking = false;
        });

        ticking = true;
      },
      {
        passive: true,
      },
    );
  }

  /* =========================================================
       5. SCROLL PROGRESS BAR
       ========================================================= */

  const progress = document.createElement("div");

  progress.className = "career-scroll-progress";

  progress.setAttribute("aria-hidden", "true");

  progress.style.cssText = `
        position:fixed;
        top:0;
        left:0;
        width:0;
        height:3px;
        z-index:2000;
        pointer-events:none;
        background:
            linear-gradient(
                90deg,
                #10b981,
                #d4af37
            );
        box-shadow:
            0 0 12px
            rgba(16,185,129,.35);
        transition:
            width .08s linear;
    `;

  document.body.appendChild(progress);

  const updateProgress = () => {
    const scrollable =
      document.documentElement.scrollHeight - window.innerHeight;

    const percentage = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;

    progress.style.width = `${Math.min(100, percentage)}%`;
  };

  window.addEventListener("scroll", updateProgress, {
    passive: true,
  });

  updateProgress();

  /* =========================================================
       6. ACTIVE CAREERS NAVIGATION
       ========================================================= */

  const currentPage = "careers.html";

  document.querySelectorAll(".nav-links a, .offcanvas a").forEach((link) => {
    const href = link.getAttribute("href");

    if (!href) return;

    const cleanHref = href.split("#")[0].split("?")[0];

    if (cleanHref === currentPage || cleanHref.endsWith("/" + currentPage)) {
      link.classList.add("active");
    }
  });

  /* =========================================================
       7. CARD TILT
       Very subtle — premium, not gimmicky
       ========================================================= */

  if (!reducedMotion) {
    document.querySelectorAll(".perk-card").forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();

        const x = event.clientX - rect.left;

        const y = event.clientY - rect.top;

        const rotateY = (x / rect.width - 0.5) * 3;

        const rotateX = -(y / rect.height - 0.5) * 3;

        card.style.transform = `translateY(-9px)
                             perspective(900px)
                             rotateX(${rotateX}deg)
                             rotateY(${rotateY}deg)`;
      });

      card.addEventListener("pointerleave", () => {
        card.style.transform = "";
      });
    });
  }

  /* =========================================================
       8. SMOOTH EMAIL APPLY INTERACTION
       ========================================================= */

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      button.classList.add("career-apply-clicked");

      setTimeout(() => {
        button.classList.remove("career-apply-clicked");
      }, 500);
    });
  });

  /* =========================================================
       9. CLEANUP
       ========================================================= */

  window.addEventListener("pagehide", () => {
    window.removeEventListener("scroll", updateProgress);
  });
});

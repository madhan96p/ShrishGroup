/* =========================================
   SHRISH GROUP - COMPONENT INJECTOR
   Dynamically loads HTML components (Hybrid Headless)
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  /**
   * Fetches an HTML file and injects it into a target container.
   * @param {string} targetElementId - The ID of the placeholder div (e.g., 'header-placeholder')
   * @param {string} componentPath - The path to the HTML file (e.g., '_components/_header.html')
   * @param {function} [callback] - Optional function to run after the component loads
   */
  async function loadComponent(targetElementId, componentPath, callback) {
    const placeholder = document.getElementById(targetElementId);

    // If the placeholder doesn't exist on this page, stop running.
    if (!placeholder) return;

    try {
      const response = await fetch(componentPath);
      if (!response.ok) {
        throw new Error(
          `Failed to load ${componentPath}: ${response.statusText}`,
        );
      }
      const htmlData = await response.text();

      // Inject the component HTML inside the placeholder
      placeholder.innerHTML = htmlData;

      // Run any scripts/events that depend on this component existing in the DOM
      if (callback) {
        callback();
      }

      // Let page-specific scripts know a component is ready
      document.dispatchEvent(
        new CustomEvent("component:loaded", {
          detail: { id: targetElementId, path: componentPath },
        }),
      );
    } catch (error) {
      console.error(`Shrish Group Injector Error:`, error);
    }
  }

  /* Marks the current page link as active in header + app nav. */
  function highlightActiveNav() {
    const file = (
      window.location.pathname.split("/").pop() || "index.html"
    ).toLowerCase();
    const key = file.replace(".html", "") || "index";
    const navKey = key === "index" ? "home" : key;

    document.querySelectorAll("[data-nav]").forEach((link) => {
      if (link.getAttribute("data-nav") === navKey) {
        link.classList.add("active");
      }
    });
  }

  // 1. Inject the Header
  loadComponent("header-placeholder", "_components/_header.html", () => {
    console.log("Header loaded successfully.");
    highlightActiveNav();

    // Mobile off-canvas menu toggle
    const mobileToggle = document.querySelector(".mobile-menu-toggle");
    if (mobileToggle) {
      mobileToggle.addEventListener("click", () => {
        document.body.classList.toggle("menu-open");
      });
    }

    document.querySelectorAll("[data-close-menu]").forEach((el) => {
      el.addEventListener("click", () =>
        document.body.classList.remove("menu-open"),
      );
    });
  });

  // 2. Inject the Hero (home page only)
  loadComponent("hero-placeholder", "_components/_hero.html", () => {
    console.log("Hero loaded successfully.");
  });

  // 3. Inject the Footer
  loadComponent("footer-placeholder", "_components/_footer.html", () => {
    console.log("Footer loaded successfully.");
    highlightActiveNav();

    // Set current year in the footer
    const yearSpan = document.getElementById("currentYear");
    if (yearSpan) {
      yearSpan.textContent = new Date().getFullYear();
    }
  });

  // 4. Inject the Cookie Banner
  loadComponent("cookie-placeholder", "_components/_cookie_banner.html");

  // 5. Inject the JSON-LD Schema (the AI brain) into <head>
  (async function injectSchema() {
    try {
      const response = await fetch("_components/_seo_schema.html");
      if (!response.ok) return;
      const html = await response.text();
      const temp = document.createElement("div");
      temp.innerHTML = html;
      temp
        .querySelectorAll('script[type="application/ld+json"]')
        .forEach((node) => {
          const script = document.createElement("script");
          script.type = "application/ld+json";
          script.textContent = node.textContent;
          document.head.appendChild(script);
        });
      console.log("SEO schema injected.");
    } catch (error) {
      console.error("Shrish Group Schema Error:", error);
    }
  })();
});

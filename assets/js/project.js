/* =========================================
   PROJECTS PAGE - category filtering (Civil / Real Estate / Travels)
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".project-card");
  const empty = document.getElementById("projectsEmpty");

  if (!buttons.length || !cards.length) return;

  function applyFilter(category) {
    let visible = 0;

    cards.forEach((card) => {
      const cardCategory = card.getAttribute("data-category");
      const show = category === "all" || cardCategory === category;
      card.classList.toggle("hidden", !show);
      if (show) visible += 1;
    });

    if (empty) empty.classList.toggle("visible", visible === 0);
  }

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      buttons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      applyFilter(btn.getAttribute("data-filter") || "all");
    });
  });

  // Support deep links like projects.html?filter=civil
  const params = new URLSearchParams(window.location.search);
  const initial = params.get("filter");
  if (initial) {
    const match = document.querySelector(
      `.filter-btn[data-filter="${initial}"]`,
    );
    if (match) match.click();
  }
});

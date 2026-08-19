/* =========================================
   HOME PAGE - cycling image fade inside the hero blob
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  const IMAGES = [
    "assets/images/sh1.webp",
    "assets/images/hero-bg.webp",
    "assets/images/project-1.webp",
    "assets/images/fleet-1.webp",
  ];

  const OVERLAY =
    "linear-gradient(135deg, rgba(15, 23, 42, 0.4) 0%, rgba(16, 185, 129, 0.4) 100%)";

  function startBlobCycle() {
    const blob = document.getElementById("heroBlob");
    if (!blob) return;

    let index = 0;

    // Preload so the crossfade stays smooth
    IMAGES.forEach((src) => {
      const img = new Image();
      img.src = src;
    });

    setInterval(() => {
      index = (index + 1) % IMAGES.length;
      blob.style.backgroundImage = `${OVERLAY}, url('${IMAGES[index]}')`;
    }, 5000);
  }

  // The hero arrives via the component injector
  document.addEventListener("component:loaded", (event) => {
    if (event.detail.id === "hero-placeholder") startBlobCycle();
  });

  startBlobCycle();
});

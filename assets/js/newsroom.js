document.addEventListener("DOMContentLoaded", () => {
  // 1. 3D Tilt Hover Effect for News Cards
  const cards = document.querySelectorAll(".news-card");

  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Calculate rotation values based on cursor position
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -4; // Max 4 deg rotation
      const rotateY = ((x - centerX) / centerX) * 4;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    // Reset card when mouse leaves
    card.addEventListener("mouseleave", () => {
      card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)`;
      card.style.transition =
        "transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)";
    });

    // Remove transition during movement for snappy response
    card.addEventListener("mouseenter", () => {
      card.style.transition = "none";
    });
  });

  // 2. Subtle Parallax for Featured Announcement Image
  const featureImg = document.querySelector(".news-feature-thumb img");

  if (featureImg) {
    window.addEventListener("scroll", () => {
      requestAnimationFrame(() => {
        const scrollPos = window.scrollY;
        // Moves the image slightly down as user scrolls down
        featureImg.style.transform = `translateY(${scrollPos * 0.05}px) scale(1.05)`;
      });
    });
  }
});

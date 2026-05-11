document.addEventListener("DOMContentLoaded", () => {
  // Scroll Animation for Cards
  const cards = document.querySelectorAll(".travel-card, .tip-card");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
        }
      });
    },
    {
      threshold: 0.2,
    }
  );

  cards.forEach((card) => observer.observe(card));

  // Smooth scroll for Hero button
  const heroBtn = document.querySelector(".hero-btn");

  if (heroBtn) {
    heroBtn.addEventListener("click", function (e) {
      e.preventDefault();

      const target = document.querySelector(
        this.getAttribute("href")
      );

      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
        });
      }
    });
  }
});
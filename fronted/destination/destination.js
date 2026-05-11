// =========================================
// Smart Flight Finder - Destination Page JS
// File: destination.js
// =========================================

document.addEventListener("DOMContentLoaded", () => {
    // Smooth scroll for hero button
    const heroBtn = document.querySelector(".hero-btn");

    if (heroBtn) {
        heroBtn.addEventListener("click", (e) => {
            e.preventDefault();

            const target = document.querySelector(
                heroBtn.getAttribute("href")
            );

            if (target) {
                target.scrollIntoView({
                    behavior: "smooth",
                });
            }
        });
    }

    // Scroll animation for cards
    const cards = document.querySelectorAll(
        ".destination-card, .category-card"
    );

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("show");
                }
            });
        },
        {
            threshold: 0.15,
        }
    );

    cards.forEach((card) => observer.observe(card));
});
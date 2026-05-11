document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("destinationSearch");
  const destinationCards = document.querySelectorAll(".destination-card");
  const destinationGrid = document.getElementById("destinationGrid");

  // Search Function
  function searchDestinations() {
    const input = searchInput.value.toLowerCase().trim();
    let found = false;

    destinationCards.forEach((card) => {
      const title = card.querySelector("h3").textContent.toLowerCase();

      if (title.includes(input) || input === "") {
        card.style.display = "block";
        found = true;
      } else {
        card.style.display = "none";
      }
    });

    // Remove old message
    const oldMessage = document.querySelector(".no-results");
    if (oldMessage) oldMessage.remove();

    // Show no results message
    if (!found) {
      const message = document.createElement("p");
      message.className = "no-results";
      message.textContent = "No matching destinations found.";
      destinationGrid.insertAdjacentElement("afterend", message);
    }
  }

  // Make function accessible to HTML button onclick
  window.searchDestinations = searchDestinations;

  // Search on Enter key
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      searchDestinations();
    }
  });

  // Scroll Animation
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
        }
      });
    },
    { threshold: 0.2 }
  );

  destinationCards.forEach((card) => observer.observe(card));
});
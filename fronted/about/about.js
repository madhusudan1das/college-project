// Adds reveal animation when elements come into view
const animatedElements = document.querySelectorAll('.animate');

const revealOnScroll = () => {
  const triggerBottom = window.innerHeight * 0.8;

  animatedElements.forEach((element) => {
    const elementTop = element.getBoundingClientRect().top;

    if (elementTop < triggerBottom) {
      element.classList.add('active');
    } else {
      element.classList.remove('active');
    }
  });
};

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll); // trigger on first load

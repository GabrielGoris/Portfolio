const slides = document.querySelectorAll(".slide");
const manualButtons = document.querySelectorAll(".manual-navigation label");

manualButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
    slides.forEach((slide) => slide.classList.remove("active"));
    slides[index].classList.add("active");
  });
});

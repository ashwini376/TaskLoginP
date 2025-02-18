const menuBtn = document.getElementById("menu-btn");
const navLinks = document.getElementById("nav-links");



const scrollRevealOption = {
  distance: "50px",
  origin: "bottom",
  duration: 1000,
};




ScrollReveal().reveal(".container__right h2", {
  ...scrollRevealOption,
  delay: 2500,
});

ScrollReveal().reveal(".container__right p", {
  ...scrollRevealOption,
  delay: 3500,
});



ScrollReveal().reveal(".location", {
  ...scrollRevealOption,
  origin: "left",
  delay: 5000,
});

ScrollReveal().reveal(".socials span", {
  ...scrollRevealOption,
  origin: "top",
  delay: 5500,
  interval: 500,
});
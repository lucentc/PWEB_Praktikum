const header     = document.querySelector('header');
const hamburger  = document.querySelector(".hamburger");
const navbar     = document.querySelector(".navbar");
let lastScrollY  = window.pageYOffset;

window.addEventListener('scroll', () => {
  const currentY = window.pageYOffset;

  if (currentY > lastScrollY && currentY > 64) {
    header.classList.add('hidden');
    header.classList.remove('scrolled');
  } else {
    header.classList.remove('hidden');
    if (currentY > 64) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  if (navbar.classList.contains("active") && currentY > lastScrollY) {
    hamburger.classList.remove("active");
    navbar.classList.remove("active");
  }
  
  lastScrollY = currentY;
});

document.addEventListener("DOMContentLoaded", function () {
  hamburger.addEventListener("click", function () {
    hamburger.classList.toggle("active");
    navbar.classList.toggle("active");
  });
});

document.querySelectorAll(".navbar li a").forEach(link => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navbar.classList.remove("active");
  });
});
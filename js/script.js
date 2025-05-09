// ==============================
//  TESTIMONIALS
// ==============================

const track = document.querySelector('.carouselTrack');
const slides = Array.from(track.children);
const carousel = document.querySelector('.testimonialCarousel');
const btnPrev = document.querySelector('.carouselButtonPrev');
const btnNext = document.querySelector('.carouselButtonNext');

const firstClone = slides[0].cloneNode(true);
const lastClone = slides[slides.length - 1].cloneNode(true);
firstClone.id = 'first-clone';
lastClone.id = 'last-clone';
track.appendChild(firstClone);
track.insertBefore(lastClone, slides[0]);

const allSlides = Array.from(track.children);
let slideWidth = slides[0].getBoundingClientRect().width;
let currentIndex = 1;

function setSlidePositions() {
  slideWidth = slides[0].getBoundingClientRect().width;
  allSlides.forEach((slide, idx) => {
    slide.style.left = `${slideWidth * idx}px`;
  });
}
setSlidePositions();

function moveToSlide(index, instant = false) {
  track.style.transition = instant ? 'none' : 'transform 0.5s ease';
  track.style.transform = `translateX(-${slideWidth * index}px)`;
}
moveToSlide(currentIndex, true);

btnPrev.addEventListener('click', () => {
  currentIndex--;
  moveToSlide(currentIndex);
});

btnNext.addEventListener('click', () => {
  currentIndex++;
  moveToSlide(currentIndex);
});

track.addEventListener('transitionend', () => {
  if (allSlides[currentIndex].id === 'first-clone') {
    currentIndex = 1;
    moveToSlide(currentIndex, true);
  }
  if (allSlides[currentIndex].id === 'last-clone') {
    currentIndex = allSlides.length - 2;
    moveToSlide(currentIndex, true);
  }
});

let autoplayInterval = setInterval(() => {
  currentIndex++;
  moveToSlide(currentIndex);
}, 5000);

carousel.addEventListener('mouseenter', () => {
  clearInterval(autoplayInterval);
});
carousel.addEventListener('mouseleave', () => {
  autoplayInterval = setInterval(() => {
    currentIndex++;
    moveToSlide(currentIndex);
  }, 5000);
});

window.addEventListener('resize', () => {
  setSlidePositions();
  moveToSlide(currentIndex, true);
});
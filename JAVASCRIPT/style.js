const hamMenu = document.querySelector(".ham-menu");

const offScreenMenu = document.querySelector(".off-screen-menu");

hamMenu.addEventListener("click", () => {
  hamMenu.classList.toggle("active");
  offScreenMenu.classList.toggle("active");
});

document.addEventListener('DOMContentLoaded', () => {
  const frontBoxes = document.querySelector('.front-boxes');
  const wrapper = document.querySelector('.containers-wrapper');
  const containers = document.querySelectorAll('.container');
  let currentIndex = 0;

  console.log('frontBoxes element:', frontBoxes); // Tarkistetaan että elementti löytyy

  // Lisää navigointipainikkeet
  const prevButton = document.createElement('button');
  prevButton.className = 'carousel-button prev';
  prevButton.innerHTML = '←';
  
  const nextButton = document.createElement('button');
  nextButton.className = 'carousel-button next';
  nextButton.innerHTML = '→';

  frontBoxes.insertBefore(prevButton, wrapper);
  frontBoxes.insertBefore(nextButton, wrapper);

  console.log('Buttons created:', prevButton, nextButton); // Tarkistetaan että napit luodaan

  
  // Karusellin toiminnallisuus
  function updateCarousel() {
    const offset = currentIndex * -(300 + 20); // containerin leveys + gap
    wrapper.style.transform = `translateX(${offset}px)`;
  }

  prevButton.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateCarousel();
    }
  });

  nextButton.addEventListener('click', () => {
    if (currentIndex < containers.length - 1) {
      currentIndex++;
      updateCarousel();
    }
  });

  // Alusta karuselli
  updateCarousel();
});
const hamMenu = document.querySelector(".ham-menu");

const offScreenMenu = document.querySelector(".off-screen-menu");

hamMenu.addEventListener("click", () => {
  hamMenu.classList.toggle("active");
  offScreenMenu.classList.toggle("active");
});

document.addEventListener('DOMContentLoaded', () => {
  const wrapper = document.querySelector('.containers-wrapper');
  const containers = document.querySelectorAll('.container');
  const frontBoxes = document.querySelector('.front-boxes');
  let currentIndex = 0;



  // Luodaan dots container
  const dotsContainer = document.createElement('div');
  dotsContainer.className = 'carousel-dots';
  
  // Luodaan pallo jokaiselle containerille
  containers.forEach((_, index) => {
    const dot = document.createElement('div');
    dot.className = 'dot';
    if (index === 0) dot.classList.add('active');
    
    dot.addEventListener('click', () => {
      currentIndex = index;
      updateCarousel();
      updateDots();
    });
    
    dotsContainer.appendChild(dot);
  });
  
  frontBoxes.appendChild(dotsContainer);

  function updateCarousel() {
    const containerWidth = document.querySelector('.container').offsetWidth;
    const gap = 20; // tai 10px mobiilissa
    const offset = currentIndex * -(containerWidth + gap);
    wrapper.style.transform = `translateX(${offset}px)`;
  }

  function updateDots() {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });
  }

  // Voit halutessasi lisätä myös automaattisen vierityksen
  setInterval(() => {
    currentIndex = (currentIndex + 1) % containers.length;
    updateCarousel();
    updateDots();
  }, 5000); // Vaihtaa 5 sekunnin välein

  // Lisätään window resize listener
  window.addEventListener('resize', () => {
    updateCarousel();
  });
}); 

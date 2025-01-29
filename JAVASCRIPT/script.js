// DARKMODE

document.addEventListener('DOMContentLoaded', () => {
  const themeSwitch = document.getElementById('theme-switch');
  const body = document.body;
  const moonSvg = document.getElementById('moon-svg');
  const sunSvg = document.getElementById('sun-svg');

  // Tarkista tallennettu teema
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  if (savedTheme === 'dark') {
    body.classList.add('darkmode');
    moonSvg.style.display = 'none';
    sunSvg.style.display = 'block';
  } else {
    moonSvg.style.display = 'block';
    sunSvg.style.display = 'none';
  }

  themeSwitch.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);

    if (newTheme === 'dark') {
      // Vaihto dark modeen viiveellä
      setTimeout(() => {
        body.classList.add('darkmode');
        moonSvg.style.display = 'none';
        sunSvg.style.display = 'block';
      }, 300);
    } else {
      // Vaihto light modeen viiveellä
      setTimeout(() => {
        body.classList.remove('darkmode');
        moonSvg.style.display = 'block';
        sunSvg.style.display = 'none';
      }, 300);
    }
  });
});

// HAMMENU

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

// Elastinen hiiren seuranta
let rafId = null;

document.addEventListener('mousemove', (e) => {
  // Haetaan rajat
  const navbar = document.querySelector('nav');
  const line = document.querySelector('.line');
  const navBottom = navbar.getBoundingClientRect().bottom;
  const lineTop = line.getBoundingClientRect().top;
  
  // Tarkistetaan onko hiiri sallitulla alueella
  if (e.clientY < navBottom || e.clientY > lineTop) {
    // Jos hiiri on alueen ulkopuolella, palautetaan elementti keskiasentoon
    const welcomeText = document.querySelector('.keyboard');
    requestAnimationFrame(() => {
      welcomeText.style.transform = 'translate3d(0, 0, 0) scale(1)';
    });
    return;
  }
  
  if (rafId) {
    cancelAnimationFrame(rafId);
  }
  
  const welcomeText = document.querySelector('.keyboard');
  const box = document.querySelector('.welcome-text-box');
  const rect = box.getBoundingClientRect();
  
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;
  
  const distX = (e.clientX - centerX) * 0.08;
  const distY = (e.clientY - centerY) * 0.06;
  
  const limitedX = Math.max(-20, Math.min(20, distX));
  const limitedY = Math.max(-20, Math.min(20, distY));
  
  const distance = Math.sqrt(limitedX * limitedX + limitedY * limitedY);
  const maxDistance = Math.sqrt(20 * 20 + 20 * 20);
  const distanceRatio = distance / maxDistance;
  
  const scale = 1.1 - (distanceRatio * 0.2);
  
  rafId = requestAnimationFrame(() => {
    welcomeText.style.transform = `translate3d(${limitedX}px, ${limitedY}px, 0) scale(${scale})`;
    rafId = null;
  });
}); 

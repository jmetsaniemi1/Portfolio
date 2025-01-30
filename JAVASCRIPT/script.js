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
      setTimeout(() => {
        body.classList.add('darkmode');
        moonSvg.style.display = 'none';
        sunSvg.style.display = 'block';
        document.querySelector('.day').style.opacity = 0;
        document.querySelector('.night').style.opacity = 1;
      }, 300);
    } else {
      setTimeout(() => {
        body.classList.remove('darkmode');
        moonSvg.style.display = 'block';
        sunSvg.style.display = 'none';
        const scrolled = window.pageYOffset;
        const scrollProgress = Math.min(Math.max((scrolled - 100) / 400, 0), 1);
        document.querySelector('.day').style.opacity = 1 - scrollProgress;
        document.querySelector('.night').style.opacity = scrollProgress;
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
  const navbar = document.querySelector('nav');
  const line = document.querySelector('.line');
  const navBottom = navbar.getBoundingClientRect().bottom;
  const lineTop = line.getBoundingClientRect().top;
  
  if (e.clientY < navBottom || e.clientY > lineTop) {
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
  
  const distX = (e.clientX - centerX) * 0.03;
  const distY = (e.clientY - centerY) * 0.02;
  
  const limitedX = Math.max(-10, Math.min(10, distX));
  const limitedY = Math.max(-10, Math.min(10, distY));
  
  const distance = Math.sqrt(limitedX * limitedX + limitedY * limitedY);
  const maxDistance = Math.sqrt(10 * 10 + 10 * 10);
  const distanceRatio = distance / maxDistance;
  
  // Käänteinen skaalaus: lähellä pienempi, kaukana suurempi
  const scale = 0.8 + (distanceRatio * 0.4); // Lähtee pienestä (0.8) ja kasvaa etäisyyden kasvaessa
  
  rafId = requestAnimationFrame(() => {
    welcomeText.style.transform = `translate3d(${limitedX}px, ${limitedY}px, 0) scale(${scale})`;
    rafId = null;
  });
}); 

// Scroll-efekti
window.addEventListener('scroll', () => {
    const dayImage = document.querySelector('.day');
    const nightImage = document.querySelector('.night');
    
    // Määritellään siirtymäalue
    const scrollStart = 100; // px milloin siirtymä alkaa
    const scrollEnd = 500;   // px milloin siirtymä loppuu
    
    const scrolled = window.pageYOffset;
    const scrollProgress = Math.min(Math.max((scrolled - scrollStart) / (scrollEnd - scrollStart), 0), 1);
    
    // Päivitetään kuvien läpinäkyvyydet
    if (!document.body.classList.contains('darkmode')) {
        dayImage.style.opacity = 1 - scrollProgress;
        nightImage.style.opacity = scrollProgress;
    }
}); 

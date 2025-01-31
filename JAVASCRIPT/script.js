// DARKMODE

document.addEventListener('DOMContentLoaded', () => {
  const themeSwitch = document.getElementById('theme-switch');
  const body = document.body;
  const moonSvg = document.getElementById('moon-svg');
  const sunSvg = document.getElementById('sun-svg');
  const dayToNightVideo = document.getElementById('dayToNight');
  const nightToDayVideo = document.getElementById('nightToDay');
  const keyboard = document.querySelector('.keyboard');

  // Aseta videoiden alkutilat
  dayToNightVideo.pause();
  nightToDayVideo.pause();

  // Tarkista tallennettu teema
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  
  // Aseta alkutilan ikonit
  if (savedTheme === 'dark') {
    body.classList.add('darkmode');
    moonSvg.style.display = 'none';
    sunSvg.style.display = 'block';
  } else {
    moonSvg.style.display = 'block';
    sunSvg.style.display = 'none';
  }

  // Teeman vaihto
  themeSwitch.addEventListener('click', () => {
    // Lisätään animaatioluokka
    keyboard.classList.add('theme-switch-animation');
    
    // Poistetaan animaatioluokka kun animaatio on valmis
    keyboard.addEventListener('animationend', () => {
      keyboard.classList.remove('theme-switch-animation');
    }, { once: true });

    if (!body.classList.contains('darkmode')) {
      // Vaihto lightmodesta darkmodeen
      dayToNightVideo.currentTime = 0;
      dayToNightVideo.play();
      body.classList.add('darkmode');
      moonSvg.style.display = 'none';
      sunSvg.style.display = 'block';
      localStorage.setItem('theme', 'dark');
    } else {
      // Vaihto darkmodesta lightmodeen
      nightToDayVideo.currentTime = 0;
      nightToDayVideo.play();
      body.classList.remove('darkmode');
      moonSvg.style.display = 'block';
      sunSvg.style.display = 'none';
      localStorage.setItem('theme', 'light');
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
  // Luodaan funktio yksittäisen karusellin alustamiseen
  function initializeCarousel(wrapperNumber) {
    const wrapper = document.querySelector(`.containers-wrapper-${wrapperNumber}`);
    if (!wrapper) return; // Varmistetaan että wrapper löytyy

    const containers = wrapper.querySelectorAll('.container');
    const frontBoxes = wrapper.closest('.front-boxes');
    let currentIndex = 0;

    // Luodaan dots container
    const dotsContainer = document.createElement('div');
    dotsContainer.className = `carousel-dots carousel-dots-${wrapperNumber}`;
    
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
      const containerWidth = wrapper.querySelector('.container').offsetWidth;
      const gap = 20;
      const offset = currentIndex * -(containerWidth + gap);
      wrapper.style.transform = `translateX(${offset}px)`;
    }

    function updateDots() {
      const dots = dotsContainer.querySelectorAll('.dot');
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentIndex);
      });
    }

    // Automaattinen vieritys eri ajoituksilla jokaiselle karusellille
    const interval = 5000 + (wrapperNumber - 1) * 1000; // 5s, 6s, ja 7s
    setInterval(() => {
      currentIndex = (currentIndex + 1) % containers.length;
      updateCarousel();
      updateDots();
    }, interval);

    // Resize listener
    window.addEventListener('resize', () => {
      updateCarousel();
    });
  }

  // Alustetaan kaikki kolme karusellia
  for (let i = 1; i <= 3; i++) {
    initializeCarousel(i);
  }
});

// Scroll-efekti welcome-tekstille
window.addEventListener('scroll', function() {
  const welcomeText = document.querySelector('.keyboard');
  const scrollPosition = window.pageYOffset;
  
  // Määritellään milloin efekti alkaa ja loppuu
  const fadeStart = 300;  // Milloin efekti alkaa (px)
  const fadeEnd = 400;    // Milloin efekti loppuu (px)
  
  // Jos scrollaus on efektialueen sisällä
  if (scrollPosition > fadeStart) {
      // Lasketaan efektin voimakkuus (0-1)
      const opacity = 1 - (Math.min(scrollPosition - fadeStart, fadeEnd - fadeStart) / (fadeEnd - fadeStart));
      
      // Lasketaan skaalaus (1 -> 0.3)
      const scale = 1 - ((1 - opacity) * 0.7);
      
      // Lasketaan siirtymä ylöspäin (-100px maksimi)
      const moveUp = (1 - opacity) * -100;
      
      // Päivitetään tyylit
      welcomeText.style.opacity = opacity;
      welcomeText.style.transform = `translateY(${moveUp}px) scale(${scale})`;
  } else {
      // Palautetaan alkutila
      welcomeText.style.opacity = 1;
      welcomeText.style.transform = 'translateY(0) scale(1)';
  }
});
// Palautetaan normaali koko kun hiiri poistuu ikkunasta
document.addEventListener('mouseleave', () => {
  const welcomeText = document.querySelector('.keyboard');
  welcomeText.style.transform = 'scale(1)';
});

// Scroll-efekti
window.addEventListener('scroll', () => {
    const dayImage = document.querySelector('.day');
    const nightImage = document.querySelector('.night');
    
    // Määritellään siirtymäalue
    const scrollStart = 400; // px milloin siirtymä alkaa
    const scrollEnd = 800;   // px milloin siirtymä loppuu
    
    const scrolled = window.pageYOffset;
    const scrollProgress = Math.min(Math.max((scrolled - scrollStart) / (scrollEnd - scrollStart), 0), 1);
    
    // Päivitetään kuvien läpinäkyvyydet
    if (!document.body.classList.contains('darkmode')) {
        dayImage.style.opacity = 1 - scrollProgress;
        nightImage.style.opacity = scrollProgress;
    }
}); 

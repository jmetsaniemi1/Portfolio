// DARKMODE-osio
document.addEventListener('DOMContentLoaded', () => {      // Odotetaan että sivu on ladattu
  // Haetaan tarvittavat elementit DOM:sta
  const themeSwitch = document.getElementById('theme-switch');     // Teeman vaihtamisen painike
  const body = document.body;                                      // Sivun body-elementti
  const moonSvg = document.getElementById('moon-svg');            // Kuu-ikoni
  const sunSvg = document.getElementById('sun-svg');              // Aurinko-ikoni
  const dayToNightVideo = document.getElementById('dayToNight');  // Päivä->yö video
  const nightToDayVideo = document.getElementById('nightToDay');  // Yö->päivä video
  const keyboard = document.querySelector('.keyboard');           // Näppäimistö-elementti

  // Pysäytetään videot alussa
  dayToNightVideo.pause();
  nightToDayVideo.pause();

  // Tarkistetaan localStorage:sta aiemmin tallennettu teema
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    body.classList.add('darkmode');                      // Lisätään darkmode-luokka
    dayToNightVideo.currentTime = dayToNightVideo.duration;  // Asetetaan video loppuun
  } else {
    nightToDayVideo.currentTime = nightToDayVideo.duration;  // Asetetaan video loppuun
  }

  // Asetetaan oikeat ikonit näkyviin teeman mukaan
  if (savedTheme === 'dark') {
    body.classList.add('darkmode');
    moonSvg.style.display = 'none';
    sunSvg.style.display = 'block';
  } else {
    moonSvg.style.display = 'block';
    sunSvg.style.display = 'none';
  }

  // Teeman vaihdon käsittely
  themeSwitch.addEventListener('click', () => {
    keyboard.classList.add('theme-switch-animation');    // Lisätään animaatio
    
    // Poistetaan animaatio kun se on valmis
    keyboard.addEventListener('animationend', () => {
      keyboard.classList.remove('theme-switch-animation');
    }, { once: true });

    if (!body.classList.contains('darkmode')) {
      // Vaihdetaan valoisasta tummaan
      dayToNightVideo.currentTime = 0;
      dayToNightVideo.play();
      body.classList.add('darkmode');
      moonSvg.style.display = 'none';
      sunSvg.style.display = 'block';
      localStorage.setItem('theme', 'dark');
    } else {
      // Vaihdetaan tummasta valoisaan
      nightToDayVideo.currentTime = 0;
      nightToDayVideo.play();
      body.classList.remove('darkmode');
      moonSvg.style.display = 'block';
      sunSvg.style.display = 'none';
      localStorage.setItem('theme', 'light');
    }
  });
});

// HAMMENU - Hampurilaisvalikon toiminnallisuus

const hamMenu = document.querySelector(".ham-menu");              // Haetaan hampurilaisvalikko-elementti
const offScreenMenu = document.querySelector(".off-screen-menu"); // Haetaan sivuvalikko-elementti

hamMenu.addEventListener("click", () => {                        // Lisätään click-kuuntelija hampurilaisvalikolle
  hamMenu.classList.toggle("active");                           // Toglataan hampurilaisvalikon active-luokka
  offScreenMenu.classList.toggle("active");                     // Toglataan sivuvalikon active-luokka
});

// Lisätään kuuntelija koko dokumentille, jotta valikko sulkeutuu klikattaessa muualle
document.addEventListener("click", (event) => {                  // Lisätään click-kuuntelija koko dokumentille
  // Tarkistetaan, ettei klikkaus osu valikkoon tai hampurilaisvalikkoon
  if (!offScreenMenu.contains(event.target) && !hamMenu.contains(event.target)) {
    hamMenu.classList.remove("active");                         // Poistetaan hampurilaisvalikon active-luokka
    offScreenMenu.classList.remove("active");                   // Poistetaan sivuvalikon active-luokka
  }
});

// Globaali muuttuja intervallien hallintaan
let carouselIntervals = [];

// Karusellin alustus
document.addEventListener('DOMContentLoaded', () => {           // Odotetaan että DOM on ladattu
  // Funktio yhden karusellin alustamiseen
  function initializeCarousel(wrapperNumber) {                 // Funktion parametrina karusellin numero
    const wrapper = document.querySelector(`.containers-wrapper-${wrapperNumber}`);  // Haetaan karusellin wrapper
    if (!wrapper) return;                                      // Jos wrapperia ei löydy, lopetetaan

    const containers = wrapper.querySelectorAll('.container');  // Haetaan kaikki containerit
    const frontBoxes = wrapper.closest('.front-boxes');        // Haetaan lähin front-boxes-elementti
    let currentIndex = 0;                                      // Alustetaan nykyinen indeksi

    // Drag-toiminnallisuuden muuttujat
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID = 0;
    let containerWidth = wrapper.querySelector('.container').offsetWidth;
    const gap = 20;

    // Touch Events
    wrapper.addEventListener('touchstart', dragStart);
    wrapper.addEventListener('touchend', dragEnd);
    wrapper.addEventListener('touchmove', drag);

    // Mouse Events
    wrapper.addEventListener('mousedown', dragStart);
    wrapper.addEventListener('mouseup', dragEnd);
    wrapper.addEventListener('mouseleave', dragEnd);
    wrapper.addEventListener('mousemove', drag);

    // Estä kontekstimenun avautuminen raahatessa
    wrapper.addEventListener('contextmenu', (e) => e.preventDefault());

    function dragStart(e) {
        if (e.type === 'touchstart') {
            startPos = e.touches[0].clientX;
        } else {
            startPos = e.clientX;
            e.preventDefault();
        }
        
        isDragging = true;
        wrapper.classList.add('dragging');
        animationID = requestAnimationFrame(animation);
    }

    function drag(e) {
        if (!isDragging) return;
        
        const currentPosition = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        const diff = currentPosition - startPos;
        currentTranslate = prevTranslate + diff;
    }

    function dragEnd() {
        isDragging = false;
        wrapper.classList.remove('dragging');
        cancelAnimationFrame(animationID);

        // Määritä lähin slide
        const moveBy = currentTranslate - prevTranslate;
        if (Math.abs(moveBy) > containerWidth / 3) {
            if (moveBy > 0 && currentIndex > 0) {
                currentIndex--;
            } else if (moveBy < 0 && currentIndex < containers.length - 1) {
                currentIndex++;
            }
        }

        goToSlide(currentIndex);
        updateDots();
    }

    function animation() {
        setSlidePosition();
        if (isDragging) requestAnimationFrame(animation);
    }

    function setSlidePosition() {
        wrapper.style.transform = `translateX(${currentTranslate}px)`;
    }

    function goToSlide(index) {
        currentIndex = index;
        prevTranslate = -(containerWidth + gap) * currentIndex;
        currentTranslate = prevTranslate;
        wrapper.style.transition = 'transform 0.3s ease-out';
        wrapper.style.transform = `translateX(${currentTranslate}px)`;
    }

    // Luodaan pallot karuselliin
    const dotsContainer = document.createElement('div');        // Luodaan div palloille
    dotsContainer.className = `carousel-dots carousel-dots-${wrapperNumber}`;  // Asetetaan luokka
    
    // Luodaan pallo jokaiselle containerille
    containers.forEach((_, index) => {                         // Käydään läpi kaikki containerit
      const dot = document.createElement('div');               // Luodaan pallo-elementti
      dot.className = 'dot';                                  // Asetetaan luokka
      if (index === 0) dot.classList.add('active');           // Ensimmäinen pallo aktiiviseksi
      
      // Lisätään pallolle click-kuuntelija
      dot.addEventListener('click', () => {                    // Kun palloa klikataan
        currentIndex = index;                                 // Päivitetään nykyinen indeksi
        updateCarousel();                                     // Päivitetään karuselli
        updateDots();                                         // Päivitetään pallot
      });
      
      dotsContainer.appendChild(dot);                         // Lisätään pallo containeriin
    });
    
    frontBoxes.appendChild(dotsContainer);                    // Lisätään pallot-container DOMiin

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

    // Luodaan automaattinen vieritys
    function startAutoScroll() {
        const interval = setInterval(() => {
            currentIndex = (currentIndex + 1) % containers.length;
            updateCarousel();
            updateDots();
        }, 5000 + (wrapperNumber - 1) * 1000); // 5s, 6s, ja 7s

        carouselIntervals.push(interval); // Tallennetaan intervalli globaaliin taulukkoon
        return interval;
    }

    // Käynnistetään automaattinen vieritys
    if (!document.querySelector('.carousel-lock-btn.locked')) {
        startAutoScroll();
    }

    // Päivitä containerWidth ikkunan koon muuttuessa
    window.addEventListener('resize', () => {
        containerWidth = wrapper.querySelector('.container').offsetWidth;
        goToSlide(currentIndex);
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
  const keys = welcomeText.querySelectorAll('.key');
  const scrollPosition = window.pageYOffset;
  
  // Muutetaan efektin alkamis- ja loppumiskohdat
  const fadeStart = 200;     // Efekti alkaa 100px kohdalla
  const fadeEnd = 400;     // Efekti loppuu 300px kohdalla
  
  // Jos scrollaus on efektialueen sisällä
  if (scrollPosition >= fadeStart) {
      const opacity = 1 - (Math.min(scrollPosition - fadeStart, fadeEnd - fadeStart) / (fadeEnd - fadeStart));
      const scale = 1 - ((1 - opacity) * 0.7);
      const moveUp = (1 - opacity) * -100;
      const rotation = (1 - opacity) * 10;
      
      // Räjähdys alkaa heti kun scrollataan
      if (scrollPosition > 0) {
          keys.forEach(key => {
              // Arvotaan jokaiselle kirjaimelle oma suunta
              const randomX = (Math.random() - 0.5) * 200;
              const randomY = (Math.random() - 0.5) * 200;
              const randomRotate = (Math.random() - 0.5) * 360;
              key.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${randomRotate}deg)`;
              key.style.opacity = '0';
              key.style.transition = 'all 0.5s ease-out';
          });
      }
      
      // Alkuperäinen häivytysanimaatio jatkuu normaalisti
      welcomeText.style.opacity = opacity;
      welcomeText.style.transform = `translateY(${moveUp}px) scale(${scale}) rotate(${rotation}deg)`;
  } else {
      welcomeText.style.opacity = 1;
      welcomeText.style.transform = 'translateY(0) scale(1) rotate(0deg)';
      // Palautetaan kirjaimet alkutilaan
      keys.forEach(key => {
          key.style.transform = 'none';
          key.style.opacity = '1';
      });
  }
});
// Palautetaan normaali koko kun hiiri poistuu ikkunasta
document.addEventListener('mouseleave', () => {
  const welcomeText = document.querySelector('.keyboard');
  welcomeText.style.transform = 'scale(1)';
});

// Certifications column toggle
document.addEventListener('DOMContentLoaded', () => {
    const viewButtons = document.querySelectorAll('.view-button');
    const contentWrapper = document.querySelector('.content-wrapper');
    const initialTopValue = -900; // Alkuperäinen top-arvo
    const moveDistance = 900;     // Matka jonka verran liikutaan
    const openDuration = 300;     // Nopea avautuminen
    const closeDuration = 1500;   // 1.5 sekunnin viive sulkemisessa
    
    viewButtons.forEach(button => {
        button.addEventListener('click', () => {
            const content = button.nextElementSibling;
            const isOpening = !content.classList.contains('open');
            content.classList.toggle('open');
            
            button.textContent = content.classList.contains('open') 
                ? `Hide ${button.textContent.split(' ')[1]}` 
                : `View ${button.textContent.split(' ')[1]}`;
            
            const certificationContent = document.querySelector('.certifications-column .certifications-content');
            const projectContent = document.querySelector('.projects-column .certifications-content');
            const isEitherOpen = certificationContent.classList.contains('open') || 
                                projectContent.classList.contains('open');
            
            // Asetetaan animaation kesto sen mukaan, ollaanko avaamassa vai sulkemassa
            const duration = isOpening ? openDuration : closeDuration;
            contentWrapper.style.transition = `top ${duration}ms ease`;
            
            // Tarkistetaan näytön koko ja asetetaan sopiva top-arvo
            const screenWidth = window.innerWidth;
            let baseTopValue;
            
            if (screenWidth > 1024) {
                baseTopValue = -800;
            } else if (screenWidth > 768) {
                baseTopValue = -400;
            } else if (screenWidth > 480) {
                baseTopValue = -100;
            } else {
                baseTopValue = -100;
            }
            
            if (isEitherOpen) {
                contentWrapper.style.top = `${baseTopValue + moveDistance}px`;
            } else {
                contentWrapper.style.top = `${baseTopValue}px`;
            }
            
            setTimeout(() => {
                contentWrapper.style.transition = '';
            }, duration);

            // Tarkista näytön koko
            const isMobile = window.innerWidth <= 768;
            
            // Poista scroll kokonaan mobiililaitteilla
            if (!isMobile) {
                const targetY = button.getBoundingClientRect().top + window.pageYOffset - 100;
                window.scrollTo({
                    top: targetY,
                    behavior: 'smooth'
                });
            }
        });
    });
}); 

// Mukautettu scrollaus-funktio
function smoothScroll(targetY, duration) {
    const startY = window.pageYOffset;
    const difference = targetY - startY;
    const startTime = performance.now();

    function step() {
        const currentTime = performance.now();
        const progress = (currentTime - startTime) / duration;

        if (progress < 1) {
            window.scrollTo(0, startY + (difference * progress));
            requestAnimationFrame(step);
        } else {
            window.scrollTo(0, targetY);
        }
    }

    requestAnimationFrame(step);
}

// Lisää tämä muiden JavaScript-koodien joukkoon
window.addEventListener('scroll', () => {
    const scrollPosition = window.pageYOffset;
    const viewportHeight = window.innerHeight;
    const wrapper1 = document.querySelector('.wrapper-1');
    const wrapper2 = document.querySelector('.wrapper-2');
    const wrapper3 = document.querySelector('.wrapper-3');
    
    // Määritellään näyttökoot
    const isMobile = window.innerWidth <= 768;
    const isTablet = window.innerWidth <= 1024 && window.innerWidth > 768;
    
    // AJOITUKSEN SÄÄTÖ:
    let scrollTrigger;
    if (isMobile) {
        scrollTrigger = 1500;     // Mobiili - myöhäisin aloitus
    } else if (isTablet) {
        scrollTrigger = 1200;     // Tablet - keskitason aloitus
    } else {
        scrollTrigger = 900;      // Desktop - SÄÄDÄ TÄTÄ ARVOA: pienempi = aiemmin, suurempi = myöhemmin
    }
    
    // NOPEUDEN SÄÄTÖ:
    let speedFactor;
    if (isMobile) {
        speedFactor = 0.3;        // Mobiili - hitain
    } else if (isTablet) {
        speedFactor = 0.4;        // Tablet - keskitaso
    } else {
        speedFactor = 0.2;        // Desktop - SÄÄDÄ TÄTÄ ARVOA: pienempi = hitaampi liike (esim. 0.3-0.7)
    }
    
    // LÄPINÄKYVYYDEN SÄÄTÖ:
    let opacityFactor;
    if (isMobile) {
        opacityFactor = 0.001;    // Mobiili - hitain häivytys
    } else if (isTablet) {
        opacityFactor = 0.0015;   // Tablet - keskitaso
    } else {
        opacityFactor = 0.001;    // Desktop - SÄÄDÄ TÄTÄ ARVOA: pienempi = hitaampi häivytys (esim. 0.001-0.003)
    }
    
    // MINIMIOPASITEETIN SÄÄTÖ:
    const minOpacity = 0.3;       // SÄÄDÄ TÄTÄ ARVOA: määrittää kuinka läpinäkyväksi elementit häipyvät (0-1)
    
    // Tarkistetaan elementtien sijainti
    const rect1 = wrapper1.getBoundingClientRect();
    const rect2 = wrapper2.getBoundingClientRect();
    const rect3 = wrapper3.getBoundingClientRect();
    
    // Animaatiot
    if (rect1.top < viewportHeight && rect1.bottom > 0 && scrollPosition > scrollTrigger) {
        wrapper1.style.transform = `translateX(${-(scrollPosition-scrollTrigger) * speedFactor}px)`;
        wrapper1.style.opacity = Math.max(1 - (scrollPosition-scrollTrigger) * opacityFactor, minOpacity);
    } else {
        wrapper1.style.transform = 'translateX(0)';
        wrapper1.style.opacity = 1;
    }
    
    if (rect2.top < viewportHeight && rect2.bottom > 0 && scrollPosition > scrollTrigger) {
        wrapper2.style.transform = `translateY(${-(scrollPosition-scrollTrigger) * speedFactor}px)`;
        wrapper2.style.opacity = Math.max(1 - (scrollPosition-scrollTrigger) * opacityFactor, minOpacity);
    } else {
        wrapper2.style.transform = 'translateY(0)';
        wrapper2.style.opacity = 1;
    }
    
    if (rect3.top < viewportHeight && rect3.bottom > 0 && scrollPosition > scrollTrigger) {
        wrapper3.style.transform = `translateX(${(scrollPosition-scrollTrigger) * speedFactor}px)`;
        wrapper3.style.opacity = Math.max(1 - (scrollPosition-scrollTrigger) * opacityFactor, minOpacity);
    } else {
        wrapper3.style.transform = 'translateX(0)';
        wrapper3.style.opacity = 1;
    }
}); 

window.addEventListener('scroll', () => {
    const columns = document.querySelector('.columns');
    const columnsPosition = columns.getBoundingClientRect().top;
    const certificationContents = document.querySelectorAll('.certifications-content');
    const isMobile = window.innerWidth <= 768;
    
    // Tarkista onko jokin sisältö auki
    const isAnyContentOpen = Array.from(certificationContents).some(content => 
        content.classList.contains('open')
    );
    
    // Jos sisältö on auki, älä lisää scroll-hide-luokkaa
    if (!isAnyContentOpen) {
        // Määritellään aloitus- ja lopetuspisteet eri näyttöko'oille
        const startPoint = isMobile ? 400 : // Mobiili
                          window.innerWidth <= 1024 ? 300 : // Tablet
                          200; // Desktop
        
        const endPoint = isMobile ? 200 : // Mobiili
                        window.innerWidth <= 1024 ? 100 : // Tablet
                        50;   // Desktop
        
        if (columnsPosition < startPoint) {
            const progress = Math.min(Math.max((startPoint - columnsPosition) / (startPoint - endPoint), 0), 1);
            
            if (progress >= 1) {
                columns.classList.add('scroll-hide');
            } else {
                columns.classList.remove('scroll-hide');
            }
        } else {
            columns.classList.remove('scroll-hide');
        }
    } else {
        columns.classList.remove('scroll-hide');
    }
}); 

// Typed animaatio viive
document.addEventListener("DOMContentLoaded", () => {
  const introText = document.querySelector(".typed-text-intro");

  if (introText) {
      const observer = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
              if (entry.isIntersecting) {
                  setTimeout(() => {
                      introText.style.opacity = "1"; // Show after 3 sec
                  }, 3000);
                  observer.unobserve(introText); // Stop observing after showing
              }
          });
      }, { threshold: 0.1 });

      observer.observe(introText);
  }
});

// OMA BIO KOESELU MUSTA LAATIKKO

// FOOTER

document.addEventListener('DOMContentLoaded', () => {
    // Haetaan tarvittavat elementit
    const projectsLink = document.querySelector('a[href="#PROJECTS"]');
    const projectsSection = document.querySelector('.columns');
    const projectsButton = document.querySelector('.projects-column .view-button');
    
    projectsLink.addEventListener('click', (e) => {
        e.preventDefault(); // Estetään oletustoiminto
        
        // Lasketaan kohteen sijainti
        const targetPosition = projectsSection.getBoundingClientRect().top + window.pageYOffset - 50; // -50 antaa hieman tilaa yläreunaan
        
        // Smooth scroll kohteeseen
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
        
        // Odotetaan scrollauksen päättymistä ennen napin painamista
        setTimeout(() => {
            // Tarkistetaan onko projektit jo auki
            if (!projectsButton.getAttribute('data-active') || 
                projectsButton.getAttribute('data-active') === 'false') {
                projectsButton.click(); // Avataan projektit
            }
        }, 1000); // 1 sekunti scrollauksen jälkeen
    });
});

// Lukitusnapin toiminnallisuus
document.addEventListener('DOMContentLoaded', () => {
    const lockBtn = document.querySelector('.carousel-lock-btn');
    const wrappersContainer = document.querySelector('.wrappers-container');
    let isLocked = false;

    function toggleLock() {
        isLocked = !isLocked;
        lockBtn.classList.toggle('locked');
        wrappersContainer.classList.toggle('locked');

        const wrappers = document.querySelectorAll('.containers-wrapper');

        if (isLocked) {
            // Pysäytetään vain automaattinen vieritys
            carouselIntervals.forEach(interval => clearInterval(interval));
            carouselIntervals = [];
        } else {
            // Käynnistetään karusellit uudelleen
            wrappers.forEach((wrapper, index) => {
                const interval = setInterval(() => {
                    const containers = wrapper.querySelectorAll('.container');
                    const dotsContainer = wrapper.closest('.front-boxes')
                        .querySelector('.carousel-dots');
                    let currentIndex = parseInt(wrapper.getAttribute('data-index') || '0');
                    
                    currentIndex = (currentIndex + 1) % containers.length;
                    wrapper.setAttribute('data-index', currentIndex);
                    
                    updateCarousel(wrapper, currentIndex, containers[0].offsetWidth);
                    updateDots(dotsContainer, currentIndex);
                }, 5000 + index * 1000);

                carouselIntervals.push(interval);
            });
        }
    }

    function updateCarousel(wrapper, index, containerWidth) {
        const gap = 20;
        const offset = index * -(containerWidth + gap);
        wrapper.style.transform = `translateX(${offset}px)`;
    }

    function updateDots(dotsContainer, currentIndex) {
        if (!dotsContainer) return;
        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    }

    lockBtn.addEventListener('click', toggleLock);
});

// FOOTEr

// Contact-linkin scroll-toiminnallisuus
document.addEventListener('DOMContentLoaded', () => {
    const contactLink = document.querySelector('a[href="#CONTACT"]');
    
    contactLink.addEventListener('click', (e) => {
        e.preventDefault();
        const footer = document.getElementById('CONTACT');
        footer.scrollIntoView({ behavior: 'smooth' });
    });
});
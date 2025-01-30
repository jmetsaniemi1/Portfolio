document.addEventListener('DOMContentLoaded', () => {
    // Tarkista että elementti on olemassa
    const carouselContainer = document.getElementById('image-carousel');
    if (!carouselContainer) return; // Jos elementtiä ei löydy, ei suoriteta koodia

    const carousel = carouselContainer.querySelector('.carousel-wrapper');
    const slides = carouselContainer.querySelectorAll('.carousel-slide');
    const dotsContainer = carouselContainer.querySelector('.carousel-dots');
    const prevButton = carouselContainer.querySelector('.carousel-button.prev');
    const nextButton = carouselContainer.querySelector('.carousel-button.next');
    
    let currentSlide = 0;
    
    // Luodaan dotit
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('carousel-dot'); // Muutettu luokan nimi!
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
    
    // Päivitä dotit
    function updateDots() {
        carouselContainer.querySelectorAll('.carousel-dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }
    
    // Siirry slideen
    function goToSlide(index) {
        currentSlide = index;
        carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
        updateDots();
    }
    
    // Seuraava slide
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        goToSlide(currentSlide);
    }
    
    // Edellinen slide
    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        goToSlide(currentSlide);
    }
    
    // Event listenerit
    if (prevButton) prevButton.addEventListener('click', prevSlide);
    if (nextButton) nextButton.addEventListener('click', nextSlide);
    
    // Automaattinen vaihto
    setInterval(nextSlide, 5000);
}); 
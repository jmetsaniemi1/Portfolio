document.addEventListener('DOMContentLoaded', () => {
    // Tarkista että elementti on olemassa
    const rotatingText = document.getElementById('rotating-text');
    if (!rotatingText) return; // Jos elementtiä ei löydy, ei suoriteta koodia

    const containers = rotatingText.querySelectorAll('.text-container');
    let currentIndex = 0;

    // Näytä ensimmäinen container heti
    containers[0].classList.add('active');

    function rotateContainers() {
        // Poista active-luokka kaikilta
        containers.forEach(container => {
            container.classList.remove('active');
        });

        // Lisää active-luokka seuraavalle
        currentIndex = (currentIndex + 1) % containers.length;
        containers[currentIndex].classList.add('active');
    }

    // Aloita rotaatio 5 sekunnin välein
    setInterval(rotateContainers, 5000);
}); 
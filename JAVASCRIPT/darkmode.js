document.addEventListener('DOMContentLoaded', () => {
  const themeSwitch = document.getElementById('theme-switch');
  const body = document.body;
  const moonSvg = document.getElementById('moon-svg');
  const sunSvg = document.getElementById('sun-svg');

  // Tarkista tallennettu teema
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    body.classList.add('darkmode');
    moonSvg.style.display = 'none';
    sunSvg.style.display = 'block';
  } else {
    moonSvg.style.display = 'block';
    sunSvg.style.display = 'none';
  }

  themeSwitch.addEventListener('click', () => {
    if (body.classList.contains('darkmode')) {
      // Vaihto light modeen viiveellä
      setTimeout(() => {
        body.classList.remove('darkmode');
        moonSvg.style.display = 'block';
        sunSvg.style.display = 'none';
        localStorage.setItem('theme', 'light');
      }, 300);
    } else {
      // Vaihto dark modeen viiveellä
      setTimeout(() => {
        body.classList.add('darkmode');
        moonSvg.style.display = 'none';
        sunSvg.style.display = 'block';
        localStorage.setItem('theme', 'dark');
      }, 300);
    }
  });
});


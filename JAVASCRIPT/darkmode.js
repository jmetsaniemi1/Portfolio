let darkmode = localStorage.getItem('darkmode');
const themeSwitch = document.getElementById('theme-switch');

// Tarkista, onko dark mode päällä sivun latauksen yhteydessä
if (darkmode === "active") {
  document.body.classList.add('darkmode');
  document.body.classList.remove('default');
} else {
  document.body.classList.add('default');
  document.body.classList.remove('darkmode');
}

// Vaihda tila napin painalluksella
themeSwitch.addEventListener('click', () => {
  darkmode = localStorage.getItem('darkmode');
  
  if (darkmode !== "active") {
    document.body.classList.add('darkmode');
    document.body.classList.remove('default');
    localStorage.setItem('darkmode', 'active');
  } else {
    document.body.classList.add('default');
    document.body.classList.remove('darkmode');
    localStorage.setItem('darkmode', null);
  }
});



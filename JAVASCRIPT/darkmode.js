let darkmode = localStorage.getItem('darkmode');
const themeSwitch = document.getElementById('theme-switch');

// Check if dark mode is already enabled on page load
if (darkmode === "active") {
    document.body.classList.add('darkmode');
} else {
    document.body.classList.remove('darkmode');
}

// Toggle dark mode on button click
themeSwitch.addEventListener('click', () => {
    darkmode = localStorage.getItem('darkmode');
    
    if (darkmode !== "active") {
        document.body.classList.add('darkmode');
        localStorage.setItem('darkmode', 'active');
    } else {
        document.body.classList.remove('darkmode');
        localStorage.setItem('darkmode', null);
    }
});



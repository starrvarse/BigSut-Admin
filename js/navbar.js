// Dynamically load navbar.html into the navbar-container
function loadNavbar() {
    fetch('navbar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('navbar-container').innerHTML = data;

            // Once the navbar is loaded, enable the burger menu toggle for mobile
            const burgerIcon = document.getElementById('burger-icon');
            const navbarMenu = document.getElementById('navbar-menu');

            if (burgerIcon && navbarMenu) {
                burgerIcon.addEventListener('click', () => {
                    navbarMenu.classList.toggle('active');
                });
            }
        })
        .catch(error => console.error('Error loading navbar:', error));
}

// Call the function to load the navbar
loadNavbar();

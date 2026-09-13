document.addEventListener('DOMContentLoaded', () => {
    // 1. Automatic Dynamic Copyright Year
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // 2. Custom Butterfly Cursor Following Effect
    const butterfly = document.getElementById('butterfly');
    if (butterfly) {
        window.addEventListener('mousemove', (e) => {
            // Smoothly move the butterfly icon to pointer position
            butterfly.style.left = `${e.clientX}px`;
            butterfly.style.top = `${e.clientY}px`;
        });
    }

    // 3. Responsive Navigation Toggle for Mobile Screens
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
        });
    }
});
<!-- script.js -->
document.addEventListener('DOMContentLoaded', function() {
// Animation des barres de compétences
    const skillBars = document.querySelectorAll('.skill-progress');
    skillBars.forEach(bar => {
        const targetWidth = bar.getAttribute('data-width');
        setTimeout(() => {
            bar.style.width = targetWidth + '%';
        }, 500);
    });

// Smooth scroll pour les liens internes
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});
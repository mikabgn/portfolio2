
    document.addEventListener('DOMContentLoaded', (event) => {
    const animateOnScrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
    if (entry.isIntersecting) {
    entry.target.classList.add('visible');
}
});
});

    document.querySelectorAll('.animate-on-scroll').forEach((element) => {
    animateOnScrollObserver.observe(element);
});
});

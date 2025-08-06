// Animação ao rolar a página
document.addEventListener('DOMContentLoaded', function () {
    const contactElements = document.querySelectorAll('.contact-info, .contact-form, .map-container');

    function checkVisibility() {
        contactElements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;

            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }

    // Inicializa elementos como invisíveis
    contactElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)';
    });

    // Verifica visibilidade ao carregar e ao rolar
    window.addEventListener('load', checkVisibility);
    window.addEventListener('scroll', checkVisibility);
});
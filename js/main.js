// Animação quando a página carrega
document.addEventListener('DOMContentLoaded', function () {
    // Animação das features
    const features = document.querySelectorAll('.feature');
    features.forEach((feature, index) => {
        setTimeout(() => {
            feature.classList.add('animated');
        }, 200 * index);
    });

    // Animação dos botões
    const buttons = document.querySelectorAll('.pages-buttons .btn');
    buttons.forEach((btn, index) => {
        setTimeout(() => {
            btn.classList.add('animated');
        }, 100 * index);
    });

    // Animação da imagem
    setTimeout(() => {
        document.querySelector('.image-preview').classList.add('animated');
    }, 300);

    // Animação da seção de contato
    setTimeout(() => {
        document.querySelector('.contact-section').classList.add('animated');
    }, 400);

    // Efeito de hover no botão de contato
    const contactBtn = document.getElementById('btn-contactar');
    const contactForm = document.getElementById('contact-form');

    contactBtn.addEventListener('click', function () {
        contactForm.style.display = contactForm.style.display === 'block' ? 'none' : 'block';
    });
});

// Animação quando o usuário rola a página
window.addEventListener('scroll', function () {
    const elements = document.querySelectorAll('.feature, .pages-buttons .btn, .image-preview, .contact-section');

    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.2;

        if (elementPosition < screenPosition) {
            element.classList.add('animated');
        }
    });
});

// Controle do formulário de contato
document.addEventListener('DOMContentLoaded', function () {
    const contactBtn = document.getElementById('btn-contactar');
    const contactForm = document.getElementById('contact-form');

    contactBtn.addEventListener('click', function () {
        contactForm.classList.toggle('show');

        // Altera o texto do botão conforme o estado
        if (contactForm.classList.contains('show')) {
            contactBtn.textContent = '✖ Fechar';
            contactBtn.style.backgroundColor = '#64748b';
        } else {
            contactBtn.textContent = '📩 Contactar';
            contactBtn.style.backgroundColor = '#a777e3d4';
        }
    });
});


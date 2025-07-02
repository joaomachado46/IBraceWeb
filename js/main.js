function showContactForm(event) {
    event.preventDefault();
    const form = document.getElementById('contact-form');
    form.style.display = 'block';
    form.scrollIntoView({ behavior: 'smooth' });
}

// Associar eventos ao carregar página
document.addEventListener('DOMContentLoaded', () => {
    const btnSaberMais = document.getElementById('btn-saber-mais');
    const btnContactar = document.getElementById('btn-contactar');

    btnSaberMais.addEventListener('click', showContactForm);
    btnContactar.addEventListener('click', showContactForm);
});


document.getElementById('btn-contactar').addEventListener('click', () => {
    const form = document.getElementById('contact-form');
    if (form.style.display === 'none' || form.style.display === '') {
        form.style.display = 'block';
        form.scrollIntoView({ behavior: 'smooth' });
    } else {
        form.style.display = 'none';
    }
});
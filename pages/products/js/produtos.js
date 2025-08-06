// Animação ao rolar a página
document.addEventListener('DOMContentLoaded', function () {
    const products = document.querySelectorAll('.product');

    // Animação inicial
    setTimeout(() => {
        products.forEach((product, index) => {
            setTimeout(() => {
                product.classList.add('animated');
            }, 150 * index);
        });
    }, 300);

    // Modal functionality
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalPrice = document.getElementById('modal-price');
    const modalClose = document.getElementById('modal-close');
    const saibaMaisBtns = document.querySelectorAll('.saiba-mais');

    saibaMaisBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const product = this.closest('.product');
            modalTitle.textContent = product.dataset.name;
            modalDesc.textContent = product.dataset.fullDesc;
            modalPrice.textContent = product.dataset.price;
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });

    modalClose.addEventListener('click', function () {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    window.addEventListener('click', function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
});

// Animação ao rolar
window.addEventListener('scroll', function () {
    const products = document.querySelectorAll('.product:not(.animated)');
    const windowHeight = window.innerHeight;

    products.forEach(product => {
        const productPosition = product.getBoundingClientRect().top;
        if (productPosition < windowHeight - 100) {
            product.classList.add('animated');
        }
    });
});
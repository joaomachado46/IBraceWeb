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

 // Adicionar evento de clique nos botões "Comprar"
        document.querySelectorAll('.btn.comprar').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const productId = this.getAttribute('data-product-id');
                const productElement = this.closest('.product');
                
                const productData = {
                    id: productId,
                    name: productElement.getAttribute('data-name'),
                    price: parseFloat(productElement.getAttribute('data-price')),
                    image: productElement.querySelector('img').src
                };
                
                // Efeito visual ao adicionar
                this.classList.add('added');
                setTimeout(() => {
                    this.classList.remove('added');
                }, 500);
                
                // Adicionar ao carrinho
                addToCart(productData);
                
                // Redirecionar para o carrinho após breve delay
                setTimeout(() => {
                    window.location.href = '../carrinho/index.html';
                }, 500);
            });
        });
        
        // Função para adicionar item ao carrinho
        function addToCart(product) {
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            
            const existingItem = cart.find(item => item.id === product.id);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    quantity: 1,
                    image: product.image
                });
            }
            
            localStorage.setItem('cart', JSON.stringify(cart));
        }
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalPrice = document.getElementById('modal-price');
    const modalClose = document.getElementById('modal-close');

    // Fun��o para abrir o modal e preencher info
    function openModal(product) {
        modalTitle.textContent = product.dataset.name;

        // Usa a descri��o completa se existir, sen�o usa a curta
        const fullDesc = product.dataset.fullDesc || product.dataset.desc;

        // Substitui quebras de linha por <br> para manter formata��o
        modalDesc.innerHTML = fullDesc.replace(/\n/g, "<br>");

        modalPrice.textContent = product.dataset.price;
        modal.style.display = 'flex';
    }

    // Fecha o modal
    function closeModal() {
        modal.style.display = 'none';
    }

    // Fecha ao clicar no bot�o fechar
    modalClose.addEventListener('click', closeModal);

    // Fecha ao clicar fora do conte�do do modal
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Bot�es "Saiba Mais"
    document.querySelectorAll('.saiba-mais').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const product = e.target.closest('.product');
            openModal(product);
        });
    });
});

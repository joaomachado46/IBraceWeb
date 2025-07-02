document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalPrice = document.getElementById('modal-price');
    const modalClose = document.getElementById('modal-close');

    // Função para abrir o modal e preencher info
    function openModal(product) {
        modalTitle.textContent = product.dataset.name;

        // Usa a descrição completa se existir, senão usa a curta
        const fullDesc = product.dataset.fullDesc || product.dataset.desc;

        // Substitui quebras de linha por <br> para manter formatação
        modalDesc.innerHTML = fullDesc.replace(/\n/g, "<br>");

        modalPrice.textContent = product.dataset.price;
        modal.style.display = 'flex';
    }

    // Fecha o modal
    function closeModal() {
        modal.style.display = 'none';
    }

    // Fecha ao clicar no botão fechar
    modalClose.addEventListener('click', closeModal);

    // Fecha ao clicar fora do conteúdo do modal
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Botões "Saiba Mais"
    document.querySelectorAll('.saiba-mais').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const product = e.target.closest('.product');
            openModal(product);
        });
    });
});

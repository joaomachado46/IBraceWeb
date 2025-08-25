document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('orderForm');
    const messageDiv = document.getElementById('message');

    // Preencher automaticamente alguns campos se existirem no localStorage
    const loadSavedData = () => {
        const savedData = JSON.parse(localStorage.getItem('ibraceFormData') || '{}');

        for (const key in savedData) {
            const field = document.getElementById(key);
            if (field) {
                field.value = savedData[key];
            }
        }
    };

    // Salvar dados no localStorage enquanto o usuário preenche o formulário
    const saveFormData = () => {
        const formData = {};
        const fields = form.querySelectorAll('input, select, textarea');

        fields.forEach(field => {
            if (field.id && field.name) {
                formData[field.id] = field.value;
            }
        });

        localStorage.setItem('ibraceFormData', JSON.stringify(formData));
    };

    // Adicionar event listeners para salvar dados enquanto digita
    const formFields = form.querySelectorAll('input, select, textarea');
    formFields.forEach(field => {
        field.addEventListener('input', saveFormData);
        field.addEventListener('change', saveFormData);
    });

    // Manipular o envio do formulário
    /*form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Validação básica
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.style.borderColor = '#e53e3e';
                isValid = false;
            } else {
                field.style.borderColor = '#d1d5db';
            }
        });

        if (!isValid) {
            showMessage('Por favor, preencha todos os campos obrigatórios.', 'error');
            return;
        }

        // Se chegou aqui, o formulário é válido
        showMessage('A processar a sua encomenda...', 'info');

        // Limpar dados salvos após envio bem-sucedido
        localStorage.removeItem('ibraceFormData');

        // Simular um atraso no processamento para melhor UX
        setTimeout(() => {
            // O Netlify vai processar automaticamente o formulário
            showMessage('Encomenda enviada com sucesso! Obrigado.', 'success');

            // Resetar o formulário após sucesso
            form.reset();

            // Redirecionar após alguns segundos
            setTimeout(() => {
                window.location.href = '../../index.html';
            }, 3000);
        }, 1500);
    });*/

    // Função para mostrar mensagens
    function showMessage(text, type) {
        messageDiv.textContent = text;
        messageDiv.className = `message ${type}`;
        messageDiv.classList.remove('hidden');

        // Esconder a mensagem após 5 segundos (exceto para mensagens de sucesso)
        if (type !== 'success') {
            setTimeout(() => {
                messageDiv.classList.add('hidden');
            }, 5000);
        }
    }

    // Carregar dados salvos quando a página carrega
    loadSavedData();
});
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('orderForm');
    const messageDiv = document.getElementById('message');

    if (!form) return;

    // --- Consentimento + modal ---
    const privacyCheckbox = document.getElementById('privacyConsent');
    const fileInput = document.getElementById('anexo');

    const privacyLink = document.getElementById('privacyLink');
    const privacyModal = document.getElementById('privacyModal');
    const privacyClose = document.getElementById('privacyClose');

    // --- Carregar automaticamente dados guardados ---
    const loadSavedData = () => {
        const savedData = JSON.parse(localStorage.getItem('ibraceFormData') || '{}');

        for (const key in savedData) {
            const field = document.getElementById(key);
            if (field) {
                field.value = savedData[key];
            }
        }
    };

    // --- Guardar dados no localStorage enquanto o utilizador preenche ---
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

    // --- Adicionar event listeners para guardar enquanto escreve ---
    const formFields = form.querySelectorAll('input, select, textarea');
    formFields.forEach(field => {
        field.addEventListener('input', saveFormData);
        field.addEventListener('change', saveFormData);
    });

    // --- Funções de mensagens ---
    function showMessage(text, type) {
        if (!messageDiv) return;

        messageDiv.textContent = text;
        messageDiv.className = `message ${type}`;
        messageDiv.classList.remove('hidden');

        if (type !== 'success') {
            setTimeout(() => {
                messageDiv.classList.add('hidden');
            }, 5000);
        }
    }

    function clearMessage() {
        if (!messageDiv) return;
        messageDiv.textContent = '';
        messageDiv.className = 'message hidden';
    }

    // --- Modal da Política de Privacidade ---
    if (privacyLink && privacyModal) {
        privacyLink.addEventListener('click', function (e) {
            e.preventDefault();
            privacyModal.style.display = 'block';
        });
    }

    if (privacyClose && privacyModal) {
        privacyClose.addEventListener('click', function () {
            privacyModal.style.display = 'none';
        });
    }

    window.addEventListener('click', function (e) {
        if (e.target === privacyModal) {
            privacyModal.style.display = 'none';
        }
    });

    // --- Validação no submit (consentimento + ficheiro + required) ---
    form.addEventListener('submit', function (e) {
        clearMessage();

        // 1) validar consentimento RGPD
        if (privacyCheckbox && !privacyCheckbox.checked) {
            e.preventDefault();
            showMessage(
                'Para prosseguir, tem de aceitar a Política de Privacidade e autorizar o tratamento dos dados.',
                'error'
            );
            return;
        }

        // 2) validar tamanho do ficheiro (se existir)
        if (fileInput && fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const maxSize = 5 * 1024 * 1024; // 5MB

            if (file.size > maxSize) {
                e.preventDefault();
                showMessage('O ficheiro selecionado é demasiado grande. Tamanho máximo: 5MB.', 'error');
                return;
            }
        }

        // 3) validação básica dos campos obrigatórios
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
            e.preventDefault();
            showMessage('Por favor, preencha todos os campos obrigatórios.', 'error');
            return;
        }

        // Se chegou aqui, deixa o Netlify tratar do submit normalmente
        localStorage.removeItem('ibraceFormData');
    });

    // Carregar dados salvos quando a página carrega
    loadSavedData();
});

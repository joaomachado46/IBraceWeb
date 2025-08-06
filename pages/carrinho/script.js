document.addEventListener('DOMContentLoaded', function() {
    // Elementos DOM
    const cartItemsContainer = document.querySelector('.cart-items');
    const braceletDataForm = document.getElementById('braceletDataForm');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const paymentMessage = document.getElementById('paymentMessage');
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('total');
    
    // Configuração da API
    const API_BASE_URL = 'https://sua-api-ibrace.com/v1';
    const IFTHENPAY_API_URL = 'https://api.ifthenpay.com/...'; // URL real da API IFTHENPAY
    
    // Carrinho de exemplo (substitua pelos dados reais)
    let cart = [
        {
            id: 1,
            name: 'Pulseira iBrace NFC',
            price: 29.99,
            quantity: 1,
            image: '../img/bracelet.jpg'
        }
    ];
    
    // Carregar dados do usuário se estiver logado
    function loadUserData() {
        const token = localStorage.getItem('authToken');
        if (!token) return;
        
        fetch(`${API_BASE_URL}/user/data`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            // Preencher automaticamente os campos
            document.getElementById('fullName').value = data.fullName || '';
            document.getElementById('phone').value = data.phone || '';
            document.getElementById('emergencyContact').value = data.emergencyContact || '';
            document.getElementById('allergies').value = data.allergies || '';
            document.getElementById('medication').value = data.medication || '';
            document.getElementById('bloodType').value = data.bloodType || '';
            
            // Se tiver telefone, preencher também o MBWay
            if (data.phone) {
                document.getElementById('mbwayPhone').value = data.phone;
            }
        })
        .catch(error => {
            console.error('Erro ao carregar dados do usuário:', error);
        });
    }
    
    // Renderizar itens do carrinho
    function renderCartItems() {
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>O seu carrinho está vazio.</p>';
            return;
        }
        
        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    <p>Quantidade: ${item.quantity}</p>
                </div>
                <div class="cart-item-price">€${item.price.toFixed(2)}</div>
            `;
            cartItemsContainer.appendChild(itemElement);
        });
        
        updateTotals();
    }
    
    // Atualizar totais
    function updateTotals() {
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = 2.50; // Valor fixo de portes
        const total = subtotal + shipping;
        
        subtotalElement.textContent = `€${subtotal.toFixed(2)}`;
        totalElement.textContent = `€${total.toFixed(2)}`;
    }
    
    // Processar pagamento
    function processPayment(paymentData) {
        showMessage(paymentMessage, 'A processar o pagamento...', 'info');
        
        // Primeiro, enviar os dados para sua API
        fetch(`${API_BASE_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify({
                items: cart,
                customerData: getFormData(),
                paymentMethod: 'MBWay'
            })
        })
        .then(response => response.json())
        .then(orderData => {
            // Depois de salvar o pedido, chamar a API da IFTHENPAY
            return fetch(IFTHENPAY_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    mbwayKey: 'SUA_CHAVE_MBWAY', // Sua chave MBWay da IFTHENPAY
                    amount: parseFloat(totalElement.textContent.replace('€', '')),
                    phone: document.getElementById('mbwayPhone').value,
                    description: `Pulseira iBrace - Pedido #${orderData.orderId}`
                })
            });
        })
        .then(response => response.json())
        .then(paymentResult => {
            if (paymentResult.Status === '0') { // Código de sucesso da IFTHENPAY
                showMessage(paymentMessage, 'Pagamento realizado com sucesso! Redirecionando...', 'success');
                setTimeout(() => {
                    window.location.href = '../order-confirmation/index.html';
                }, 2000);
            } else {
                throw new Error(paymentResult.Message || 'Erro no processamento do pagamento');
            }
        })
        .catch(error => {
            showMessage(paymentMessage, error.message || 'Ocorreu um erro ao processar o pagamento', 'error');
            console.error('Erro no pagamento:', error);
        });
    }
    
    // Obter dados do formulário
    function getFormData() {
        return {
            fullName: document.getElementById('fullName').value,
            phone: document.getElementById('phone').value,
            emergencyContact: document.getElementById('emergencyContact').value,
            allergies: document.getElementById('allergies').value,
            medication: document.getElementById('medication').value,
            bloodType: document.getElementById('bloodType').value
        };
    }
    
    // Mostrar mensagens
    function showMessage(element, text, type) {
        element.textContent = text;
        element.className = `message ${type}`;
        element.style.display = 'block';
    }
    
    // Event Listeners
    checkoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Validar formulário
        if (!braceletDataForm.checkValidity()) {
            showMessage(paymentMessage, 'Por favor, preencha todos os campos obrigatórios', 'error');
            return;
        }
        
        if (!document.getElementById('mbwayPhone').checkValidity()) {
            showMessage(paymentMessage, 'Por favor, insira um número de telemóvel MBWay válido', 'error');
            return;
        }
        
        // Processar pagamento
        processPayment({
            method: 'MBWay',
            phone: document.getElementById('mbwayPhone').value,
            amount: parseFloat(totalElement.textContent.replace('€', ''))
        });
    });
    
    // Inicialização
    loadUserData();
    renderCartItems();
});
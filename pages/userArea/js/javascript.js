// Elementos DOM
const userIcon = document.getElementById('userIcon');
const userDropdown = document.getElementById('userDropdown');
const logoutBtn = document.getElementById('logoutBtn');
const loginModal = document.getElementById('loginModal');
const loginForm = document.getElementById('loginForm');
const loginMessage = document.getElementById('loginMessage');
const userArea = document.getElementById('userArea');
const userMessage = document.getElementById('userMessage');
const requestForm = document.getElementById('requestForm');

// API Configuration
const API_BASE_URL = 'https://appnfcinformation-c8hah7bvgmeecvff.westeurope-01.azurewebsites.net/v1/';
const API_ENDPOINTS = {
    login: 'auth/login',
    userData: 'user/data',
    requestChange: 'user/request-change'
};

// Verifica se a página atual é a área do usuário
function isUserAreaPage() {
    return window.location.pathname.toLowerCase().includes('/userarea/');
}

// Verifica se o usuário está logado
function isLoggedIn() {
    return !!localStorage.getItem('authToken');
}

// Mostra mensagens de feedback
function showMessage(element, text, type) {
    element.textContent = text;
    element.className = `message ${type}`;
    element.style.display = 'block';
    
    setTimeout(() => {
        element.style.display = 'none';
    }, 5000);
}

// Reseta o formulário de login
function resetLoginForm() {
    loginForm.reset();
    loginMessage.style.display = 'none';
}

// Carrega os dados do usuário/pet
async function loadUserData() {
    const token = localStorage.getItem('authToken');
    if (!token) return;

    try {
        const response = await fetch(API_BASE_URL + API_ENDPOINTS.userData, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const userData = await response.json();
            displayUserData(userData);
            userArea.style.display = 'block';
        } else {
            throw new Error('Failed to load user data');
        }
    } catch (error) {
        showMessage(userMessage, 'Erro ao carregar dados do utilizador', 'error');
        console.error('User data error:', error);
    }
}

// Exibe os dados na página (humano OU pet)
function displayUserData(data) {
    const isPet = data.isPet === true;

    const fullNameEl = document.getElementById('userFullName');
    const emailEl = document.getElementById('userEmail');
    const avatarEl = document.getElementById('userAvatar');

    const personalTitle = document.querySelector('[data-section="personal-title"]');
    const contactTitle = document.querySelector('[data-section="contact-title"]');
    const medicalTitle = document.querySelector('[data-section="medical-title"]');

    // Cabeçalho
    fullNameEl.textContent = data.fullName || data.nome || '--';
    emailEl.textContent = data.email || '--';
    avatarEl.textContent = isPet ? '🐾' : (data.avatar || '👤');

    // Campos base
    const userNameEl = document.getElementById('userName');
    const userAgeEl = document.getElementById('userAge');
    const userAddressEl = document.getElementById('userAddress');

    const userPhoneEl = document.getElementById('userPhone');
    const userContactEmailEl = document.getElementById('userContactEmail');
    const emergencyContactEl = document.getElementById('emergencyContact');

    const userAllergiesEl = document.getElementById('userAllergies');
    const userMedicationEl = document.getElementById('userMedication');
    const bloodTypeEl = document.getElementById('bloodType');

    if (!isPet) {
        // ---------- UTILIZADOR NORMAL ----------
        if (personalTitle) personalTitle.textContent = 'Informações Pessoais';
        if (contactTitle) contactTitle.textContent = 'Contactos';
        if (medicalTitle) medicalTitle.textContent = 'Informações Médicas';

        userNameEl.textContent = data.name || '--';
        userAgeEl.textContent = data.age || '--';
        userAddressEl.textContent = data.address || '--';

        userPhoneEl.textContent = data.phone || '--';
        userContactEmailEl.textContent = data.contactEmail || '--';
        emergencyContactEl.textContent = data.emergencyContact || '--';

        userAllergiesEl.textContent = data.allergies || 'Nenhuma registada';
        userMedicationEl.textContent = data.medication || 'Nenhuma registada';
        bloodTypeEl.textContent = data.bloodType || '--';
    } else {
        // ---------- PET ----------
        if (personalTitle) personalTitle.textContent = 'Informações do Animal';
        if (contactTitle) contactTitle.textContent = 'Contactos / Tutores';
        if (medicalTitle) medicalTitle.textContent = 'Informações de Saúde';

        // Personal Info (nome, espécie, raça, idade, peso)
        userNameEl.textContent = data.nome || data.fullName || '--';
        userAgeEl.textContent = data.idade != null ? data.idade : '--';

        let especieRaca = '';
        if (data.especie) especieRaca += data.especie;
        if (data.raca) especieRaca += (especieRaca ? ' - ' : '') + data.raca;
        if (data.peso != null) especieRaca += (especieRaca ? ' | ' : '') + `${data.peso} kg`;
        userAddressEl.textContent = especieRaca || '--';

        // Contactos: tutores + email
        userPhoneEl.textContent = data.tutorPrincipal || data.tutorPrincipalTel || '--';
        userContactEmailEl.textContent = data.email || '--';

        const contactoEmerg = data.tutorSecundario || data.tutorSecundarioTel || data.veterinarioTel;
        emergencyContactEl.textContent = contactoEmerg || '--';

        // Saúde
        userAllergiesEl.textContent = data.alergias || 'Nenhuma registada';
        userMedicationEl.textContent = data.vacinacao || 'Nenhuma registada';
        bloodTypeEl.textContent = data.infoEmergencia || '--';
    }
}

// Event Listeners

// Mostrar dropdown ou modal de login dependendo do estado
userIcon.addEventListener('click', (e) => {
    e.stopPropagation();
    
    if (isLoggedIn()) {
        userDropdown.classList.toggle('show');
    } else {
        loginModal.style.display = 'flex';
    }
});

// Fechar dropdown ao clicar fora
document.addEventListener('click', (e) => {
    if (!e.target.closest('.user-container')) {
        userDropdown.classList.remove('show');
    }
});

// Logout - limpa a sessão e redireciona
logoutBtn.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('authToken');
    window.location.href = '../../index.html';
});

// Login Form Submission
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    try {
        const response = await fetch(API_BASE_URL + API_ENDPOINTS.login, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
            showMessage(loginMessage, 'Login efetuado com sucesso!', 'success');
            localStorage.setItem('authToken', data.token);
            
            setTimeout(() => {
                loginModal.style.display = 'none';
                resetLoginForm();
                
                if (isUserAreaPage()) {
                    window.location.reload();
                }
            }, 1500);
        } else {
            showMessage(loginMessage, data.message || 'Credenciais inválidas', 'error');
        }
    } catch (error) {
        showMessage(loginMessage, 'Erro de conexão. Tente novamente.', 'error');
        console.error('Login error:', error);
    }
});

// Request Change Form
requestForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem('authToken');
    const message = document.getElementById('requestMessage').value;
    
    try {
        const response = await fetch(API_BASE_URL + API_ENDPOINTS.requestChange, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ request: message })
        });

        if (response.ok) {
            showMessage(userMessage, 'Pedido enviado com sucesso!', 'success');
            requestForm.reset();
        } else {
            throw new Error('Failed to submit request');
        }
    } catch (error) {
        showMessage(userMessage, 'Erro ao enviar pedido', 'error');
        console.error('Request error:', error);
    }
});

// Inicialização da página
document.addEventListener('DOMContentLoaded', () => {
    if (!isLoggedIn() && isUserAreaPage()) {
        loginModal.style.display = 'flex';
    } else if (isLoggedIn()) {
        loadUserData();
    }
});

// Fechar modal ao clicar fora e redirecionar se na página de usuário
loginModal.addEventListener('click', function(e) {
    if (e.target === loginModal) {
        loginModal.style.display = 'none';
        resetLoginForm();
        
        if (isUserAreaPage()) {
            window.location.href = '../../index.html';
        }
    }
});

// Fechar com ESC e redirecionar se na página de usuário
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && loginModal.style.display === 'flex') {
        loginModal.style.display = 'none';
        resetLoginForm();
        
        if (isUserAreaPage()) {
            window.location.href = '../../index.html';
        }
    }
});

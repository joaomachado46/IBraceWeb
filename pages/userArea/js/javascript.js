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

// API Configuration - agora via Netlify Functions (NADA de Azure no front!)
const API_ENDPOINTS = {
    login: '/.netlify/functions/auth-login',
    userData: '/.netlify/functions/user-data',
    requestChange: '/.netlify/functions/request-change'
};

// guarda o último user carregado (para o form Netlify)
let currentUserData = null;
let currentIsPet = false;

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
        const response = await fetch(API_ENDPOINTS.userData, {
            method: 'GET',
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
    // guardar para usarmos depois no submit do form
    currentUserData = data;
    currentIsPet = data.isPet === true;

    const isPet = currentIsPet;

    const fullNameEl = document.getElementById('userFullName');
    const emailEl = document.getElementById('userEmail');
    const avatarEl = document.getElementById('userAvatar');

    // Cabeçalho
    fullNameEl.textContent = data.fullName || data.nome || '--';
    emailEl.textContent = data.email || '--';
    avatarEl.textContent = isPet ? '🐾' : (data.avatar || '👤');

    const humanDetails = document.getElementById('humanDetails');
    const petDetails = document.getElementById('petDetails');

    if (!isPet) {
        // ---------- UTILIZADOR NORMAL ----------
        humanDetails.style.display = 'grid';
        petDetails.style.display = 'none';

        document.getElementById('humanName').textContent = data.name || '--';
        document.getElementById('humanAge').textContent = data.age || '--';
        document.getElementById('humanAddress').textContent = data.address || '--';

        document.getElementById('humanPhone').textContent = data.phone || '--';
        document.getElementById('humanContactEmail').textContent = data.contactEmail || '--';
        document.getElementById('humanEmergencyContact').textContent = data.emergencyContact || '--';

        document.getElementById('humanAllergies').textContent = data.allergies || 'Nenhuma registada';
        document.getElementById('humanMedication').textContent = data.medication || 'Nenhuma registada';
        document.getElementById('humanBloodType').textContent = data.bloodType || '--';
    } else {
        // ---------- PET ----------
        humanDetails.style.display = 'none';
        petDetails.style.display = 'grid';

        document.getElementById('petNome').textContent = data.nome || data.fullName || '--';

        let especieRaca = '';
        if (data.especie) especieRaca += data.especie;
        if (data.raca) especieRaca += (especieRaca ? ' - ' : '') + data.raca;
        document.getElementById('petEspecieRaca').textContent = especieRaca || '--';

        document.getElementById('petIdade').textContent =
            data.idade != null ? data.idade : '--';

        document.getElementById('petPeso').textContent =
            data.peso != null ? `${data.peso} kg` : '--';

        document.getElementById('petTutorPrincipal').textContent =
            data.tutorPrincipal || data.tutorPrincipalTel || data.tutor_principal_tel || '--';

        document.getElementById('petTutorSecundario').textContent =
            data.tutorSecundario || data.tutorSecundarioTel || data.tutor_secundario_tel || '--';

        document.getElementById('petEmail').textContent = data.email || '--';

        document.getElementById('petVacinacao').textContent = data.vacinacao || 'Nenhuma registada';
        document.getElementById('petAlergias').textContent = data.alergias || 'Nenhuma registada';
        document.getElementById('petVeterinarioNome').textContent =
            data.veterinarioNome || data.veterinario_nome || '--';
        document.getElementById('petVeterinarioTel').textContent =
            data.veterinarioTel || data.veterinario_tel || '--';
        document.getElementById('petInfoEmergencia').textContent =
            data.infoEmergencia || data.info_emergencia || '--';
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
        const response = await fetch(API_ENDPOINTS.login, {
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

// Request Change Form - API + Netlify Form
requestForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // vamos controlar o fluxo

    const token = localStorage.getItem('authToken');
    const message = document.getElementById('requestMessage').value;

    // 1) Preencher os campos hidden do Netlify Form com o que está no ecrã
    try {
        const isPet = currentIsPet === true;

        // tipo de registo
        const nfIsPet = document.getElementById('nfIsPet');
        if (nfIsPet) nfIsPet.value = isPet ? 'true' : 'false';

        // cabeçalho
        const fullName = document.getElementById('userFullName')?.textContent || '';
        const email = document.getElementById('userEmail')?.textContent || '';

        const nfFullName = document.getElementById('nfFullName');
        const nfEmail = document.getElementById('nfEmail');

        if (nfFullName) nfFullName.value = fullName;
        if (nfEmail) nfEmail.value = email;

        if (!isPet) {
            // ---------- HUMANOS ----------
            const nfHumanName = document.getElementById('nfHumanName');
            const nfHumanAge = document.getElementById('nfHumanAge');
            const nfHumanAddress = document.getElementById('nfHumanAddress');
            const nfHumanPhone = document.getElementById('nfHumanPhone');
            const nfHumanEmergencyContact = document.getElementById('nfHumanEmergencyContact');
            const nfHumanAllergies = document.getElementById('nfHumanAllergies');
            const nfHumanMedication = document.getElementById('nfHumanMedication');
            const nfHumanBloodType = document.getElementById('nfHumanBloodType');

            if (nfHumanName) nfHumanName.value = document.getElementById('humanName')?.textContent || '';
            if (nfHumanAge) nfHumanAge.value = document.getElementById('humanAge')?.textContent || '';
            if (nfHumanAddress) nfHumanAddress.value = document.getElementById('humanAddress')?.textContent || '';
            if (nfHumanPhone) nfHumanPhone.value = document.getElementById('humanPhone')?.textContent || '';
            if (nfHumanEmergencyContact) nfHumanEmergencyContact.value = document.getElementById('humanEmergencyContact')?.textContent || '';
            if (nfHumanAllergies) nfHumanAllergies.value = document.getElementById('humanAllergies')?.textContent || '';
            if (nfHumanMedication) nfHumanMedication.value = document.getElementById('humanMedication')?.textContent || '';
            if (nfHumanBloodType) nfHumanBloodType.value = document.getElementById('humanBloodType')?.textContent || '';
        } else {
            // ---------- PETS ----------
            const nfPetNome = document.getElementById('nfPetNome');
            const nfPetEspecieRaca = document.getElementById('nfPetEspecieRaca');
            const nfPetIdade = document.getElementById('nfPetIdade');
            const nfPetPeso = document.getElementById('nfPetPeso');
            const nfPetTutorPrincipal = document.getElementById('nfPetTutorPrincipal');
            const nfPetTutorSecundario = document.getElementById('nfPetTutorSecundario');
            const nfPetVacinacao = document.getElementById('nfPetVacinacao');
            const nfPetAlergias = document.getElementById('nfPetAlergias');
            const nfPetVeterinarioNome = document.getElementById('nfPetVeterinarioNome');
            const nfPetVeterinarioTel = document.getElementById('nfPetVeterinarioTel');
            const nfPetInfoEmergencia = document.getElementById('nfPetInfoEmergencia');

            if (nfPetNome) nfPetNome.value = document.getElementById('petNome')?.textContent || '';
            if (nfPetEspecieRaca) nfPetEspecieRaca.value = document.getElementById('petEspecieRaca')?.textContent || '';
            if (nfPetIdade) nfPetIdade.value = document.getElementById('petIdade')?.textContent || '';
            if (nfPetPeso) nfPetPeso.value = document.getElementById('petPeso')?.textContent || '';
            if (nfPetTutorPrincipal) nfPetTutorPrincipal.value = document.getElementById('petTutorPrincipal')?.textContent || '';
            if (nfPetTutorSecundario) nfPetTutorSecundario.value = document.getElementById('petTutorSecundario')?.textContent || '';
            if (nfPetVacinacao) nfPetVacinacao.value = document.getElementById('petVacinacao')?.textContent || '';
            if (nfPetAlergias) nfPetAlergias.value = document.getElementById('petAlergias')?.textContent || '';
            if (nfPetVeterinarioNome) nfPetVeterinarioNome.value = document.getElementById('petVeterinarioNome')?.textContent || '';
            if (nfPetVeterinarioTel) nfPetVeterinarioTel.value = document.getElementById('petVeterinarioTel')?.textContent || '';
            if (nfPetInfoEmergencia) nfPetInfoEmergencia.value = document.getElementById('petInfoEmergencia')?.textContent || '';
        }
    } catch (err) {
        console.warn('Erro ao preencher campos Netlify (hidden):', err);
    }

    // 2) Enviar também para a tua API /request-change (com token)
    try {
        const response = await fetch(API_ENDPOINTS.requestChange, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ request: message })
        });

        if (response.ok) {
            showMessage(userMessage, 'Pedido enviado com sucesso!', 'success');
            // opcional: limpar textarea
            // requestForm.reset();

            // 3) Depois de tudo OK na tua API, submeter o form para o Netlify
            setTimeout(() => {
                requestForm.submit(); // POST normal -> Netlify Forms -> redirect para thankyou.html
            }, 800);
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

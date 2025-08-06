// auth.js - Coloque este arquivo na pasta js/
const API_BASE_URL = 'https://appnfcinformation-c8hah7bvgmeecvff.westeurope-01.azurewebsites.net/v1/';
const API_ENDPOINTS = {
    login: '/auth/login',
    userData: '/user/data'
};

function isLoggedIn() {
    return !!localStorage.getItem('authToken');
}

function showMessage(element, text, type) {
    element.textContent = text;
    element.className = `message ${type}`;
    element.style.display = 'block';
    setTimeout(() => element.style.display = 'none', 5000);
}

async function handleLogin(username, password) {
    try {
        const response = await fetch(API_BASE_URL + API_ENDPOINTS.login, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('authToken', data.token);
            return { success: true };
        } else {
            return { success: false, message: data.message || 'Credenciais inválidas' };
        }
    } catch (error) {
        return { success: false, message: 'Erro de conexão' };
    }
}

function setupUserIcon() {
    const userIcon = document.getElementById('userIcon');
    if (!userIcon) return;

    userIcon.addEventListener('click', () => {
        if (isLoggedIn()) {
            window.location.href = 'user.html';
        } else {
            document.getElementById('loginModal').style.display = 'flex';
        }
    });
}

// Inicialização em todas as páginas
document.addEventListener('DOMContentLoaded', () => {
    setupUserIcon();
    
    // Se estiver na página de login e já logado, redireciona
    if (window.location.pathname.includes('login.html') && isLoggedIn()) {
        window.location.href = 'user.html';
    }
});
// Elementos da interface
const avisoElement = document.getElementById('aviso-localizacao');
const btnAtivarGps = document.getElementById('btn-ativar-gps');
const gpsStatusIcon = avisoElement.querySelector('.gps-status-icon');
const gpsStatusText = avisoElement.querySelector('.gps-status-text');

function obterPageId() {
    const parts = window.location.pathname.split('/').filter(Boolean);
    let last = parts[parts.length - 1];

    // se terminar em .html, usamos a penúltima parte
    if (last.endsWith('.html') && parts.length > 1) {
        last = parts[parts.length - 2];
    }

    return last;
}

// Função para atualizar o status do GPS na interface
function atualizarStatusGPS(icon, texto, tipoAlerta) {
    gpsStatusIcon.innerHTML = icon;
    gpsStatusText.textContent = texto;

    avisoElement.classList.remove('sucesso', 'perigo');

    if (tipoAlerta) {
        avisoElement.classList.add(tipoAlerta);
    }
}

// Função para mostrar o aviso de ativação do GPS
function mostrarAvisoGPS() {
    avisoElement.classList.remove('ocultar');
    atualizarStatusGPS('❌', 'Não foi possível obter a localização. Por favor, ative o GPS.', 'perigo');
}

// Função para tentar obter a localização
function tentarObterLocalizacao() {
    avisoElement.classList.remove('ocultar');
    atualizarStatusGPS('<span class="loading"></span>', 'Solicitando acesso à sua localização...');

    if (!navigator.geolocation) {
        atualizarStatusGPS('❌', 'Seu navegador não suporta geolocalização.', 'perigo');
        return;
    }

    navigator.geolocation.getCurrentPosition(
        function (pos) {
            console.log("📍 Localização obtida:");
            console.log("Latitude:", pos.coords.latitude);
            console.log("Longitude:", pos.coords.longitude);

            atualizarStatusGPS('✅', 'Localização obtida com sucesso! Enviando dados...', 'sucesso');

            // ✅ obter o ID da página
            const pageId = obterPageId();
            console.log("PageId:", pageId);

            // Enviar para o servidor via Netlify Function
            fetch('/.netlify/functions/localizacao', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    pageId: pageId, // ✅ em vez de userKey
                    latitude: pos.coords.latitude.toString(),
                    longitude: pos.coords.longitude.toString()
                })
            })
            .then(res => {
                if (!res.ok) {
                    throw new Error('Erro ao enviar para o servidor (' + res.status + ')');
                }
                // a tua function devolve { ok: true }, por isso tentamos ler JSON
                return res.json().catch(() => ({}));
            })
            .then(data => {
                console.log("✅ Enviado via Netlify Function", data);
                setTimeout(() => {
                    avisoElement.classList.add('ocultar');
                }, 3000);
            })
            .catch(err => {
                console.error("❌ Erro:", err);
                atualizarStatusGPS('⚠️', 'Localização obtida, mas erro ao enviar dados.', 'perigo');
            });

        },
        function (err) {
            console.error("Erro ao obter localização:", err);
            mostrarAvisoGPS();
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}

// Evento quando a página carrega
window.addEventListener('load', function() {
    // Solicitar a localização automaticamente após um breve delay
    setTimeout(tentarObterLocalizacao, 1000);
});

// Configurar o botão de ativar GPS
// btnAtivarGps.addEventListener('click', tentarObterLocalizacao);

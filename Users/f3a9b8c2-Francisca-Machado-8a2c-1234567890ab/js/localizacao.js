  // Elementos da interface
        const avisoElement = document.getElementById('aviso-localizacao');
        const btnAtivarGps = document.getElementById('btn-ativar-gps');
        const gpsStatusIcon = avisoElement.querySelector('.gps-status-icon');
        const gpsStatusText = avisoElement.querySelector('.gps-status-text');
        
        // IDs de usuário
        const userid = '525019daefcb432ca5c9562518bf1bc7';
        
        // Função para atualizar o status do GPS na interface
        function atualizarStatusGPS(icon, texto, tipoAlerta) {
            gpsStatusIcon.innerHTML = icon;
            gpsStatusText.textContent = texto;
            
            // Remover classes de tipo de alerta anteriores
            avisoElement.classList.remove('sucesso', 'perigo');
            
            // Adicionar nova classe se especificado
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
                    
                    // Enviar para o servidor
                    fetch('https://appnfcinformation-c8hah7bvgmeecvff.westeurope-01.azurewebsites.net/Localizacao', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': '*/*'
                        },
                        body: JSON.stringify({
                            userKey: userid,
                            latitude: pos.coords.latitude.toString(),
                            longitude: pos.coords.longitude.toString()
                        })
                    })
                    .then(res => res)
                    .then(data => {
                        console.log("✅ Enviado", data);
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
        //btnAtivarGps.addEventListener('click', tentarObterLocalizacao);
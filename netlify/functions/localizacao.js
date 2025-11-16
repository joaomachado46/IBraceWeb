// netlify/functions/localizacao.js

// Mapa pageId -> userKey real
const userMap = {
  // adicionar mais USERS aqui conforme necessário
  // Maria
  '7d88ab56-maria-machado-88cb-1d1aa9ed2442': '525019daefcb432ca5c9562518bf1bc6',
  // Francisca
  'f3a9b8c2-francisca-machado-8a2c-1234567890ab': '525019daefcb432ca5c9562518bf1bc7',

  // adicionar mais ANIMAIS aqui conforme necessário
  '62e35d45-9fd2-viky-a3e2-d4e82b394d32': '525019daefcb432ca5c9562518bf1bc8'
};

exports.handler = async (event) => {
  try {
    console.log('--- [localizacao] Nova chamada ---');
    console.log('HTTP Method:', event.httpMethod);
    console.log('Raw body:', event.body);

    if (event.httpMethod !== 'POST') {
      console.error('Método não permitido:', event.httpMethod);
      return { statusCode: 405, body: 'Método não permitido' };
    }

    // agora esperamos pageId, latitude, longitude
    const { pageId, latitude, longitude } = JSON.parse(event.body || '{}');

    console.log('Parsed body -> pageId:', pageId, ', latitude:', latitude, ', longitude:', longitude);

    if (!pageId || !latitude || !longitude) {
      console.error('Parâmetros em falta:', { pageId, latitude, longitude });
      return { statusCode: 400, body: 'Parâmetros em falta' };
    }

    // ir buscar a userKey correta pelo pageId
    const userKey = userMap[pageId];

    console.log('UserKey obtida a partir do pageId:', pageId, '=>', userKey);

    if (!userKey) {
      console.error('pageId desconhecido:', pageId);
      return { statusCode: 404, body: 'Utilizador não encontrado para este pageId' };
    }

    const azureUrl = process.env.AZURE_LOCALIZACAO_URL;
    const azureApiKey = process.env.AZURE_API_KEY; // se tiveres

    console.log('AZURE_LOCALIZACAO_URL:', azureUrl ? 'definida' : 'NÃO definida');
    console.log('AZURE_API_KEY está definida?', !!azureApiKey);

    if (!azureUrl) {
      console.error('AZURE_LOCALIZACAO_URL não está definida');
      return { statusCode: 500, body: 'Configuração do servidor em falta' };
    }

    console.log('A enviar para Azure com body:', {
      userKey,
      latitude: latitude.toString(),
      longitude: longitude.toString()
    });

    const resp = await fetch(azureUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
        ...(azureApiKey ? { 'X-Api-Key': azureApiKey } : {})
      },
      body: JSON.stringify({
        userKey: userKey, // <- já vai a userKey mapeada
        latitude: latitude.toString(),
        longitude: longitude.toString()
      })
    });

    const text = await resp.text();

    console.log('Resposta da Azure -> status:', resp.status, ', body:', text);

    if (!resp.ok) {
      console.error('Erro Azure:', resp.status, text);
      return { statusCode: resp.status, body: text };
    }

    console.log('--- [localizacao] Sucesso ---');

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true })
    };
  } catch (e) {
    console.error('Erro Function:', e);
    return { statusCode: 500, body: 'Erro interno' };
  }
};

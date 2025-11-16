// netlify/functions/localizacao.js

// Mapa pageId -> userKey real
const userMap = {
  // EXEMPLO:
  // "ID da página" : "userKey real usada na Azure"
  //'7d88ab56-maria-machado-88cb-1d1aa9ed2442': '525019daefcb432ca5c9562518bf1bc6',
  'f3a9b8c2-francisca-machado-8a2c-1234567890ab': '525019daefcb432ca5c9562518bf1bc7',
};

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Método não permitido' };
    }

    // agora esperamos pageId, latitude, longitude
    const { pageId, latitude, longitude } = JSON.parse(event.body || '{}');

    if (!pageId || !latitude || !longitude) {
      return { statusCode: 400, body: 'Parâmetros em falta' };
    }

    // ir buscar a userKey correta pelo pageId
    const userKey = userMap[pageId];

    if (!userKey) {
      console.error('pageId desconhecido:', pageId);
      return { statusCode: 404, body: 'Utilizador não encontrado para este pageId' };
    }

    const azureUrl = process.env.AZURE_LOCALIZACAO_URL;
    const azureApiKey = process.env.AZURE_API_KEY; // se tiveres

    if (!azureUrl) {
      console.error('AZURE_LOCALIZACAO_URL não está definida');
      return { statusCode: 500, body: 'Configuração do servidor em falta' };
    }

    const resp = await fetch(azureUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
        ...(azureApiKey ? { 'X-Api-Key': azureApiKey } : {})
      },
      body: JSON.stringify({
        userKey: userKey,                 // <- já vai a userKey mapeada
        latitude: latitude.toString(),
        longitude: longitude.toString()
      })
    });

    const text = await resp.text();

    if (!resp.ok) {
      console.error('Erro Azure:', resp.status, text);
      return { statusCode: resp.status, body: text };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true })
    };
  } catch (e) {
    console.error('Erro Function:', e);
    return { statusCode: 500, body: 'Erro interno' };
  }
};

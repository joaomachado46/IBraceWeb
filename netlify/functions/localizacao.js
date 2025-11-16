// netlify/functions/localizacao.js

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Método não permitido' };
    }

    const { userKey, latitude, longitude } = JSON.parse(event.body || '{}');

    if (!userKey || !latitude || !longitude) {
      return { statusCode: 400, body: 'Parâmetros em falta' };
    }

    const azureUrl = process.env.AZURE_LOCALIZACAO_URL;
    const azureApiKey = process.env.AZURE_API_KEY; // se tiveres

    const resp = await fetch(azureUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*',
        ...(azureApiKey ? { 'X-Api-Key': azureApiKey } : {})
      },
      body: JSON.stringify({
        userKey,
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

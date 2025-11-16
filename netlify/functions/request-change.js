exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Método não permitido' };
    }

    const token = event.headers.authorization;

    if (!token) {
      return { statusCode: 401, body: 'Token missing' };
    }

    const { request } = JSON.parse(event.body || '{}');

    const azureUrl = process.env.AZURE_API_URL + '/user/request-change';

    const resp = await fetch(azureUrl, {
      method: 'POST',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ request })
    });

    const text = await resp.text();

    return {
      statusCode: resp.status,
      body: text
    };

  } catch (err) {
    console.error('REQUEST ERROR:', err);
    return { statusCode: 500, body: 'Internal error' };
  }
};

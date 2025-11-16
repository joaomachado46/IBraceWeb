exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Método não permitido' };
    }

    const { username, password } = JSON.parse(event.body || '{}');

    if (!username || !password) {
      return { statusCode: 400, body: 'Missing credentials' };
    }

    const azureUrl = process.env.AZURE_API_URL + '/auth/login';

    const resp = await fetch(azureUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const text = await resp.text();

    return {
      statusCode: resp.status,
      body: text
    };

  } catch (err) {
    console.error('AUTH ERROR:', err);
    return { statusCode: 500, body: 'Internal error' };
  }
};

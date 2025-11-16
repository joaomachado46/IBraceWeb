exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'GET') {
      return { statusCode: 405, body: 'Método não permitido' };
    }

    const token = event.headers.authorization;

    if (!token) {
      return { statusCode: 401, body: 'Token missing' };
    }

    const azureUrl = process.env.AZURE_API_URL + '/user/data';

    const resp = await fetch(azureUrl, {
      method: 'GET',
      headers: {
        'Authorization': token,
        'Accept': 'application/json'
      }
    });

    const text = await resp.text();

    return {
      statusCode: resp.status,
      body: text
    };

  } catch (err) {
    console.error('USER DATA ERROR:', err);
    return { statusCode: 500, body: 'Internal error' };
  }
};

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const CLIMATIQ_URL = 'https://api.climatiq.io/data/v1/estimate';

async function estimateEmission(body) {
  const apiKey = process.env.CLIMATIQ_API_KEY;
  if (!apiKey) {
    throw new Error('Climatiq API key missing. Set CLIMATIQ_API_KEY in .env');
  }

  const response = await fetch(CLIMATIQ_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data?.message || data?.error || 'Climatiq request failed';
    const status = data?.status || response.status;
    const err = new Error(message);
    err.status = status;
    err.details = data;
    throw err;
  }

  return data;
}

module.exports = { estimateEmission };


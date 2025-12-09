// src/pages/api/price-query.js  (ESM, Astro >= 3.0)
export async function post({ request }) {
  const body = await request.json();
  const { brand, model, year } = body;
  if (!brand || !model || !year) return new Response(JSON.stringify({ error: 'Eksik alan' }), { status: 400 });

  const queries = [
    `${year} ${brand} ${model} fiyat`,
    `${year} ${brand} ${model} sahibinden fiyat`,
    `${year} ${brand} ${model} arabam fiyat`
  ];

  const raw = await fetch('https://api.moonshot.ai/v1/search', {
    method: 'POST',
    headers: { Authorization: import.meta.env.MOONSHOT_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ queries })
  }).then(r => r.json());

  const prices = [...raw.join(' ').matchAll(/\b(\d{3,4})\.?000\b/g)].map(m => Number(m[1] + '000'));
  if (!prices.length) return new Response(JSON.stringify({ error: 'İlan bulunamadı' }), { status: 404 });

  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const sensible = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);

  return new Response(JSON.stringify({ min, max, sensible }), {
    status: 200,
    headers: { 'Access-Control-Allow-Origin': '*' }
  });
}
export default async function handler(req, res) {
  const BASE_URL = 'https://course.summitglobal.id/products';

  try {
    if (req.method === 'GET') {
      const response = await fetch(BASE_URL);
      const data = await response.json();
      return res.status(200).json(data.body?.data || []);
    }

    if (req.method === 'POST') {
      const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body),
      });
      const data = await response.json();
      return res.status(response.status).json(data.body?.data || []);
    }

    if (req.method === 'PUT') {
      const { id } = req.query;
      const response = await fetch(`${BASE_URL}?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body),
      });
      const data = await response.json();
      return res.status(response.status).json(data.body?.data || []);
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      const response = await fetch(`${BASE_URL}?id=${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      return res.status(response.status).json(data.body?.data || true);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
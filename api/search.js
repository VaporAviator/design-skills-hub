// Semantic search using Jina AI embeddings + Vercel KV cosine similarity
const KV_URL = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;
const JINA_API_KEY = process.env.JINA_API_KEY;

async function kvGet(key) {
  const res = await fetch(`${KV_URL}/get/${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${KV_TOKEN}` },
  });
  const data = await res.json();
  if (!data.result) return null;
  // Handle single or multi-encoded JSON
  let val = data.result;
  if (typeof val === 'string') {
    try { val = JSON.parse(val); } catch(e) { return null; }
  }
  if (typeof val === 'string') {
    try { val = JSON.parse(val); } catch(e) { return null; }
  }
  return val;
}

async function kvKeys(pattern) {
  const res = await fetch(`${KV_URL}/keys/${pattern}`, {
    headers: { Authorization: `Bearer ${KV_TOKEN}` },
  });
  const data = await res.json();
  return data.result || [];
}

async function getEmbedding(text) {
  const res = await fetch('https://api.jina.ai/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${JINA_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'jina-embeddings-v3',
      input: [text],
      task: 'retrieval.query',
    }),
  });
  if (!res.ok) throw new Error(`Jina API error: ${res.status}`);
  const data = await res.json();
  return data.data[0].embedding;
}

function cosineSimilarity(a, b) {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const query = req.method === 'POST' ? req.body?.query : req.query?.q;
  if (!query || query.trim().length < 2) {
    return res.status(400).json({ error: 'Query too short' });
  }

  if (!JINA_API_KEY) {
    return res.status(503).json({ error: 'Search not configured' });
  }

  try {
    const queryEmbed = await getEmbedding(query.trim());
    const keys = await kvKeys('jina:*');

    if (!keys.length) {
      return res.status(200).json({ results: [], query, note: 'No embeddings indexed yet' });
    }

    const results = [];
    await Promise.all(keys.map(async (key) => {
      try {
        const record = await kvGet(key);
        if (!record?.embedding) return;
        const score = cosineSimilarity(queryEmbed, record.embedding);
        if (score > 0.20) {
          results.push({
            skill_id: record.id,
            name: record.name,
            description: record.description,
            type: record.type,
            path: record.path,
            installs: record.installs,
            similarity: score,
          });
        }
      } catch (_) {}
    }));

    results.sort((a, b) => b.similarity - a.similarity);
    return res.status(200).json({ results: results.slice(0, 8), query });
  } catch (err) {
    console.error('Search error:', err);
    return res.status(500).json({ error: err.message });
  }
};

async function kvCommand(command, ...args) {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify([command, ...args]),
  });
  const data = await res.json();
  return data.result;
}

async function kvPipeline(commands) {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;

  const res = await fetch(`${url}/pipeline`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(commands),
  });
  const data = await res.json();
  return data;
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayStr() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

async function handleGet(req, res) {
  const { action } = req.query || {};

  if (action === 'trending') {
    const today = todayStr();
    const yesterday = yesterdayStr();

    // Scan trending keys for today and yesterday
    const todayKeys = await scanKeys(`trending:${today}:*`);
    const yesterdayKeys = await scanKeys(`trending:${yesterday}:*`);

    const allKeys = [...new Set([...todayKeys, ...yesterdayKeys])];
    if (allKeys.length === 0) {
      return res.status(200).json({ trending: [] });
    }

    // MGET all values at once
    const values = await kvCommand('MGET', ...allKeys);
    const counts = {};

    allKeys.forEach((key, i) => {
      // key format: trending:YYYY-MM-DD:skill/path
      const skill = key.replace(/^trending:\d{4}-\d{2}-\d{2}:/, '');
      const val = parseInt(values?.[i], 10) || 0;
      counts[skill] = (counts[skill] || 0) + val;
    });

    const trending = Object.entries(counts)
      .map(([skill, clicks]) => ({ skill, clicks }))
      .sort((a, b) => b.clicks - a.clicks);

    return res.status(200).json({ trending });
  }

  return res.status(400).json({ error: 'Unknown action' });
}

async function scanKeys(pattern) {
  const keys = [];
  let cursor = '0';
  do {
    const result = await kvCommand('SCAN', cursor, 'MATCH', pattern, 'COUNT', '100');
    if (!result) break;
    cursor = result[0];
    if (result[1]) keys.push(...result[1]);
  } while (cursor !== '0');
  return keys;
}

async function handlePost(req, res) {
  const { skill } = req.body || {};
  if (!skill) return res.status(400).json({ error: 'skill path required' });

  const today = todayStr();
  const trendingKey = `trending:${today}:${skill}`;

  // Increment all-time installs and daily trending in parallel
  const [count] = await Promise.all([
    kvCommand('INCR', `installs:${skill}`),
    kvCommand('INCR', trendingKey).then(() =>
      kvCommand('EXPIRE', trendingKey, 172800) // 48h TTL
    ),
  ]);

  return res.status(200).json({ success: true, skill, count: count ?? 0 });
}

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method === 'GET') return handleGet(req, res);
  if (req.method === 'POST') return handlePost(req, res);

  return res.status(405).json({ error: 'Method not allowed' });
};

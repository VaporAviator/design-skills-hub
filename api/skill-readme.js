module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { path, subpath } = req.query;

  if (!path || !/^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/.test(path)) {
    return res.status(400).json({ error: 'Invalid path. Expected owner/repo format.' });
  }

  const [owner, repo] = path.split('/');
  const headers = { 'User-Agent': 'DesignSkillsHub/1.0' };
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
  }

  // Cache on Vercel CDN for 1 hour, serve stale up to 24h while revalidating
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400, max-age=300');

  // Build list of URLs to try in priority order
  const base = `https://raw.githubusercontent.com/${owner}/${repo}/main`;
  const urls = [
    { url: `${base}/SKILL.md`, source: 'SKILL.md' },
  ];
  if (subpath) {
    urls.push({ url: `${base}/${subpath}/SKILL.md`, source: `${subpath}/SKILL.md` });
  }
  urls.push({ url: `${base}/README.md`, source: 'README.md' });
  if (subpath) {
    urls.push({ url: `${base}/${subpath}/README.md`, source: `${subpath}/README.md` });
  }

  try {
    for (const { url, source } of urls) {
      try {
        const r = await fetch(url, { headers });
        if (r.ok) {
          const content = await r.text();
          if (content && content.trim().length > 0) {
            return res.status(200).json({ content, source });
          }
        }
      } catch (_) {
        // try next URL
      }
    }

    return res.status(404).json({ error: 'No SKILL.md or README.md found.' });
  } catch (e) {
    console.error('Skill readme fetch error:', e);
    return res.status(500).json({ error: 'Failed to fetch skill documentation.' });
  }
};

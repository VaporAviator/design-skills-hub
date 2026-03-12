// Shared scan logic — used by this endpoint and submit-skill.js
function scanContent(text) {
  const dimensions = [
    {
      name: 'Code Injection',
      patterns: [
        /\beval\s*\(/gi,
        /\bexec\s*\(/gi,
        /\bnew\s+Function\s*\(/gi,
        /document\.write\s*\(/gi,
        /\.innerHTML\s*=/gi,
        /setTimeout\s*\(\s*["'`]/gi,
        /setInterval\s*\(\s*["'`]/gi,
      ],
    },
    {
      name: 'Data Exfiltration',
      patterns: [
        /\bcurl\s+.*https?:\/\//gi,
        /\bwget\s+/gi,
        /\bfetch\s*\(\s*["'`]https?:\/\/(?!github|raw\.githubusercontent|cdn)/gi,
        /XMLHttpRequest/gi,
        /navigator\.sendBeacon/gi,
        /atob\s*\(|btoa\s*\(/gi,
      ],
    },
    {
      name: 'Credential Access',
      patterns: [
        /process\.env\b/gi,
        /\bAPI[_-]?KEY\b/gi,
        /\bSECRET[_-]?KEY\b/gi,
        /\bACCESS[_-]?TOKEN\b/gi,
        /\bpassword\s*[:=]/gi,
        /\.env\b/gi,
        /credentials?\s*[:=\[{]/gi,
      ],
    },
    {
      name: 'File System Risk',
      patterns: [
        /fs\.(write|unlink|rmdir|rm)\b/gi,
        /\brm\s+-rf\b/gi,
        /\bchmod\b/gi,
        /\bchown\b/gi,
        />\s*\/[a-z]/gi,
        /fs\.createWriteStream/gi,
      ],
    },
    {
      name: 'Network & Persistence',
      patterns: [
        /\bcrontab\b|\bcron\s+/gi,
        /\bsystemctl\b/gi,
        /\blaunchctl\b/gi,
        /\bsudo\b/gi,
        /child_process/gi,
        /\bspawn\s*\(|\bexecSync\s*\(/gi,
      ],
    },
  ];

  const results = dimensions.map(dim => {
    const flags = [];
    for (const pattern of dim.patterns) {
      const matches = text.match(pattern);
      if (matches) {
        flags.push(...matches.map(m => m.trim()));
      }
    }
    // Deduplicate
    const uniqueFlags = [...new Set(flags)];
    let status = 'pass';
    if (uniqueFlags.length >= 3) status = 'fail';
    else if (uniqueFlags.length >= 1) status = 'warning';

    return { name: dim.name, status, flags: uniqueFlags };
  });

  const hasAnyFail = results.some(r => r.status === 'fail');
  const hasAnyWarning = results.some(r => r.status === 'warning');

  let overall = 'passed';
  if (hasAnyFail) overall = 'failed';
  else if (hasAnyWarning) overall = 'warning';

  return {
    status: overall,
    dimensions: results,
    scannedAt: new Date().toISOString(),
  };
}

// Fetch SKILL.md / README.md from GitHub (same fallback as skill-readme.js)
async function fetchSkillContent(repoPath, subpath) {
  const [owner, repo] = repoPath.split('/');
  const headers = { 'User-Agent': 'DesignSkillsHub/1.0' };
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
  }

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

  for (const { url, source } of urls) {
    try {
      const r = await fetch(url, { headers });
      if (r.ok) {
        const content = await r.text();
        if (content && content.trim().length > 0) {
          return { content, source };
        }
      }
    } catch (_) {
      // try next
    }
  }
  return null;
}

// Vercel API endpoint handler
async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { path, subpath } = req.query;

  if (!path || !/^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/.test(path)) {
    return res.status(400).json({ error: 'Invalid path. Expected owner/repo format.' });
  }

  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=172800, max-age=600');

  try {
    const result = await fetchSkillContent(path, subpath);
    if (!result) {
      return res.status(404).json({ error: 'No SKILL.md or README.md found.' });
    }

    const scan = scanContent(result.content);
    scan.source = result.source;
    return res.status(200).json(scan);
  } catch (e) {
    console.error('Security scan error:', e);
    return res.status(500).json({ error: 'Security scan failed.' });
  }
}

// Export handler as default for Vercel, attach shared functions
module.exports = handler;
module.exports.scanContent = scanContent;
module.exports.fetchSkillContent = fetchSkillContent;

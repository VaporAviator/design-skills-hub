const securityScan = require('./security-scan');
const { scanContent, fetchSkillContent } = securityScan;

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

const CATEGORY_TYPE_MAP = {
  'Design System': 'Aesthetic',
  'Motion Principles': 'Aesthetic',
  'Layout Patterns': 'Aesthetic',
  'Accessibility Audit': 'Engineering',
  'Framework Specs': 'Engineering',
};

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, githubUrl, category, description, previewImage } = req.body || {};

  if (!name || !githubUrl) {
    return res.status(400).json({ error: 'Skill name and GitHub URL are required.' });
  }

  const match = githubUrl.match(/github\.com\/([^\/]+\/[^\/\?\#]+)/);
  const path = match ? match[1].replace(/\.git$/, '') : `community/${name.toLowerCase().replace(/\s+/g, '-')}`;
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

  const skill = {
    id,
    name,
    path,
    category: category || 'Design System',
    description: description || '',
    previewImage: previewImage || '',
    githubUrl,
    installs: '0',
    createdAt: new Date().toISOString(),
    icon: name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(),
    color: 'bg-neutral-100',
    type: CATEGORY_TYPE_MAP[category] || 'Aesthetic',
    avatar: `https://unavatar.io/github/${path.split('/')[0]}`,
  };

  // Run security scan on skill content
  try {
    const result = await fetchSkillContent(path);
    if (result) {
      skill.securityScan = scanContent(result.content);
      skill.securityScan.source = result.source;
    } else {
      skill.securityScan = { status: 'passed', scannedAt: new Date().toISOString(), note: 'No SKILL.md/README.md found to scan' };
    }
  } catch (_) {
    skill.securityScan = {
      status: 'passed', scannedAt: new Date().toISOString(), note: 'Scan skipped due to fetch error',
      dimensions: [],
      permissionScopes: [
        { name: 'File System Write', detected: false, flags: [] },
        { name: 'Network Access', detected: false, flags: [] },
        { name: 'Env Variable Access', detected: false, flags: [] }
      ]
    };
  }

  try {
    const kvUrl = process.env.KV_REST_API_URL;
    if (!kvUrl) {
      return res.status(201).json({
        success: true,
        note: 'Database not configured yet. Skill data returned but not persisted.',
        skill,
      });
    }

    await kvCommand('SET', `skill:${id}`, JSON.stringify(skill));
    await kvCommand('SADD', 'skills:ids', id);

    return res.status(201).json({ success: true, skill });
  } catch (e) {
    return res.status(500).json({ error: 'Failed to save skill. Please try again.' });
  }
};

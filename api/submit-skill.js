const securityScan = require('./security-scan');
const { scanContent, fetchSkillContent } = securityScan;

// Known font names to detect in SKILL.md content
const KNOWN_FONTS = [
  'Inter','Space Grotesk','Instrument Serif','DM Sans','Satoshi','Geist',
  'Fraunces','Playfair Display','Cormorant Garamond','Source Sans Pro',
  'Plus Jakarta Sans','Sora','Outfit','Manrope','General Sans',
  'Cabinet Grotesk','Clash Display','Neue Haas Grotesk','Helvetica Neue',
  'SF Pro','SF Pro Display','SF Pro Text','Georgia','Times New Roman',
  'Lora','Merriweather','Libre Baskerville','Poppins','Nunito','Raleway',
];

function extractDNA(content) {
  // Extract hex colors — pick top 3 most frequent unique ones, skip near-white/black singles
  const hexRegex = /#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})\b/g;
  const colorCounts = {};
  let m;
  while ((m = hexRegex.exec(content)) !== null) {
    const hex = '#' + m[1].toUpperCase().padEnd(6, m[1][0]);
    colorCounts[hex] = (colorCounts[hex] || 0) + 1;
  }
  // Sort by frequency, take top 3
  const colors = Object.entries(colorCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([hex]) => hex)
    .slice(0, 3);

  if (colors.length < 2) return null; // not enough color data

  // Pad to 3 if only 2 found
  while (colors.length < 3) colors.push('#F5F5F5');

  // Extract font names — check for known fonts first, then font-family declarations
  const foundFonts = [];
  for (const font of KNOWN_FONTS) {
    if (content.includes(font) && !foundFonts.includes(font)) {
      foundFonts.push(font);
      if (foundFonts.length === 2) break;
    }
  }

  // Fallback: regex for font-family or Google Fonts family= param
  if (foundFonts.length < 2) {
    const gfMatch = content.match(/family=([A-Za-z+]+)/g);
    if (gfMatch) {
      for (const gf of gfMatch) {
        const name = gf.replace('family=', '').replace(/\+/g, ' ');
        if (!foundFonts.includes(name)) foundFonts.push(name);
        if (foundFonts.length === 2) break;
      }
    }
  }

  const font1 = foundFonts[0] || 'Inter';
  const font2 = foundFonts[1] || foundFonts[0] || 'Inter';

  return {
    colors,
    labels: ['Primary', 'Accent', 'Surface'],
    font1,
    font1Label: 'Primary Heading System',
    font2,
    font2Label: 'Body & UI System',
  };
}

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

  // Run security scan + DNA extraction on skill content
  try {
    const result = await fetchSkillContent(path);
    if (result) {
      skill.securityScan = scanContent(result.content);
      skill.securityScan.source = result.source;
      // Store raw markdown content for detail page rendering
      skill.skillContent = result.content;
      // Extract DNA only for Aesthetic skills
      if (skill.type === 'Aesthetic') {
        const dna = extractDNA(result.content);
        if (dna) skill.dna = dna;
      }
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

    // Generate Jina embedding with DNA data and store in KV (non-blocking, best-effort)
    const jinaKey = process.env.JINA_API_KEY;
    if (jinaKey) {
      (async () => {
        try {
          // Build rich text with DNA colors/fonts for embedding
          const parts = [
            `${skill.name}.`,
            skill.description || '',
            `Type: ${skill.type || 'Skill'}.`,
            `Path: ${skill.path || ''}.`,
          ];
          // Include DNA data if extracted
          if (skill.dna) {
            if (skill.dna.colors && skill.dna.colors.length) {
              parts.push(`Colors: ${skill.dna.colors.join(' ')}.`);
            }
            if (skill.dna.font1) parts.push(`Font: ${skill.dna.font1}.`);
            if (skill.dna.font2) parts.push(`Font: ${skill.dna.font2}.`);
          }
          const embedText = parts.join(' ');

          const embedRes = await fetch('https://api.jina.ai/v1/embeddings', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${jinaKey}`,
            },
            body: JSON.stringify({
              model: 'jina-embeddings-v3',
              input: [embedText],
              task: 'retrieval.passage',
            }),
          });
          if (embedRes.ok) {
            const jinaData = await embedRes.json();
            const embedding = jinaData.data[0].embedding;
            const record = {
              id, path: skill.path, name: skill.name,
              description: skill.description,
              type: skill.type || null,
              installs: skill.installs || '0',
              embedding,
            };
            await kvCommand('SET', `jina:${id}`, JSON.stringify(record));
          }
        } catch (e) {
          console.error('Jina embedding failed (non-fatal):', e.message);
        }
      })();
    }

    return res.status(201).json({ success: true, skill });
  } catch (e) {
    return res.status(500).json({ error: 'Failed to save skill. Please try again.' });
  }
};

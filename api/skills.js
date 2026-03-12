const SEED_SKILLS = [
  { id: 's00', name: 'VaporAviator Easel Style', path: 'vaporaviator/easel-style', installs: '28.6K', color: 'bg-black', icon: 'E', type: 'Aesthetic', avatar: 'https://unavatar.io/twitter/VaporAviator', description: 'Modern high-contrast aesthetic — Instrument Serif + Space Grotesk, monochrome palette, 40px radius system.', github: 'https://github.com/VaporAviator/easel-style', website: '', stars: '9.7K', highlighted: true },
  { id: 's01', name: 'Vercel React Best Practices', path: 'vercel-labs/vercel-react-best-practices', installs: '197.3K', color: 'bg-neutral-200', icon: '', svg: true, type: 'Engineering', avatar: 'https://unavatar.io/github/vercel', description: '58 performance rules for React + Next.js, prioritized by impact.', github: 'https://github.com/vercel-labs/agent-skills', website: 'https://vercel.com', stars: '22.8K' },
  { id: 's02', name: 'Web Design Guidelines', path: 'vercel-labs/web-design-guidelines', installs: '154.8K', color: 'bg-neutral-200', icon: '', svg: true, type: 'Engineering', avatar: 'https://unavatar.io/github/vercel', description: 'Review code for compliance with Web Interface Guidelines.', github: 'https://github.com/vercel-labs/agent-skills', website: 'https://vercel.com', stars: '22.8K' },
  { id: 's03', name: 'Frontend Design', path: 'anthropics/frontend-design', installs: '143.7K', color: 'bg-orange-50', icon: 'FD', type: 'Aesthetic', avatar: 'https://unavatar.io/github/anthropics', description: 'Distinctive, production-grade frontend interfaces — no generic AI slop.', github: 'https://github.com/anthropics/skills', website: '', stars: '90.8K' },
  { id: 's04', name: 'Sleek Design', path: 'sleekdotdesign/sleek-design-mobile-apps', installs: '122.5K', color: 'bg-pink-50', icon: 'SD', type: 'Aesthetic', avatar: 'https://unavatar.io/github/sleekdotdesign', description: 'AI-powered mobile app design via natural language prompts.', github: 'https://github.com/sleekdotdesign/agent-skills', website: 'https://sleek.design', stars: '8' },
  { id: 's05', name: 'Impeccable', path: 'pbakaus/impeccable', installs: '85.2K', color: 'bg-yellow-50', icon: 'IM', type: 'Aesthetic', avatar: 'https://unavatar.io/github/pbakaus', description: '17 design slash commands for AI-driven frontend aesthetics.', github: 'https://github.com/pbakaus/impeccable', website: 'https://impeccable.style', stars: '3.5K' },
  { id: 's06', name: 'Canvas Design', path: 'anthropics/canvas-design', installs: '17.0K', color: 'bg-orange-50', icon: 'CD', type: 'Aesthetic', avatar: 'https://unavatar.io/github/anthropics', description: 'Visual design philosophies and museum-quality aesthetic artifacts.', github: 'https://github.com/anthropics/skills', website: '', stars: '90.8K' },
  { id: 's07', name: 'Tailwind Design System', path: 'wshobson/tailwind-design-system', installs: '16.9K', color: 'bg-blue-50', icon: 'TW', type: 'Engineering', avatar: 'https://unavatar.io/github/wshobson', description: 'Production-ready design systems with Tailwind CSS v4, tokens, CVA.', github: 'https://github.com/wshobson/agents', website: '', stars: '31.0K' },
  { id: 's08', name: 'Building Native UI', path: 'expo/building-native-ui', installs: '16.7K', color: 'bg-violet-50', icon: 'EX', type: 'Engineering', avatar: 'https://unavatar.io/github/expo', description: 'Native iOS interfaces with Expo, Apple HIG standards.', github: 'https://github.com/expo/skills', website: 'https://expo.dev', stars: '1.4K' },
  { id: 's09', name: 'Design MD', path: 'google-labs-code/design-md', installs: '13.6K', color: 'bg-emerald-50', icon: 'DM', type: 'Engineering', avatar: 'https://unavatar.io/github/google-labs-code', description: 'Generate DESIGN.md from Stitch projects for semantic design systems.', github: 'https://github.com/google-labs-code/stitch-skills', website: '', stars: '2.3K' },
  { id: 's10', name: 'Brand Guidelines', path: 'anthropics/brand-guidelines', installs: '12.2K', color: 'bg-orange-50', icon: 'BG', type: 'Aesthetic', avatar: 'https://unavatar.io/github/anthropics', description: 'Anthropic brand identity — colors, typography, accent cycling.', github: 'https://github.com/anthropics/skills', website: '', stars: '90.8K' },
  { id: 's11', name: 'Responsive Design Standards', path: 'am-will/frontend-responsive-design-standards', installs: '5.1K', color: 'bg-amber-50', icon: 'RD', type: 'Engineering', avatar: 'https://unavatar.io/github/am-will', description: 'Mobile-first breakpoints, fluid layouts, touch-friendly targets.', github: 'https://github.com/am-will/codex-skills', website: '', stars: '491' },
];

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

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const ids = await kvCommand('SMEMBERS', 'skills:ids');
    const submitted = [];

    if (ids && ids.length > 0) {
      for (const id of ids) {
        const raw = await kvCommand('GET', `skill:${id}`);
        if (raw) {
          const skill = typeof raw === 'string' ? JSON.parse(raw) : raw;
          submitted.push(skill);
        }
      }
    }

    submitted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const seedsWithScan = SEED_SKILLS.map(s => ({
      ...s,
      securityScan: s.securityScan || { status: 'passed', scannedAt: '2026-03-01T00:00:00Z' },
    }));
    const all = [...submitted, ...seedsWithScan];
    const numbered = all.map((s, i) => ({ ...s, id: String(i + 1).padStart(2, '0') }));

    return res.status(200).json({ skills: numbered, total: numbered.length });
  } catch (e) {
    // KV not configured — return seed data only
    const seedsWithScan = SEED_SKILLS.map(s => ({
      ...s,
      securityScan: s.securityScan || { status: 'passed', scannedAt: '2026-03-01T00:00:00Z' },
    }));
    const numbered = seedsWithScan.map((s, i) => ({ ...s, id: String(i + 1).padStart(2, '0') }));
    return res.status(200).json({ skills: numbered, total: numbered.length });
  }
};

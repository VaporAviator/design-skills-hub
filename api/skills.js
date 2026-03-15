const SEED_SKILLS = [
  {
    id: 's00', name: 'VaporAviator Easel Style', path: 'vaporaviator/easel-style', installs: '85.5K', color: 'bg-black', icon: 'E', type: 'Aesthetic', avatar: 'https://unavatar.io/twitter/VaporAviator', description: 'Modern, high-contrast aesthetic with Instrument Serif and Space Grotesk. The signature style of VaporAviator NYC. Defines a complete visual DNA including typography hierarchy, spatial composition, and monochrome palette with 40px radius system.', github: 'https://github.com/VaporAviator/easel-style', githubUrl: 'https://github.com/VaporAviator/easel-style', website: '', stars: '9.7K', highlighted: true, installCmd: 'npx skills add https://github.com/VaporAviator/easel-style',
    dna: { colors: ['#f9f9f9','#000000','#ffffff'], labels: ['Background','Accent','Foreground'], font1: 'Instrument Serif', font1Label: 'Primary Heading System', font2: 'Space Grotesk', font2Label: 'Functional & Body System' },
    securityScan: { status: 'passed', scannedAt: '2026-03-12T23:11:52.514Z', source: 'SKILL.md', dimensions: [{ name: 'Code Injection', status: 'pass', flags: [] }, { name: 'Data Exfiltration', status: 'pass', flags: [] }, { name: 'Credential Access', status: 'pass', flags: [] }, { name: 'File System Risk', status: 'pass', flags: [] }, { name: 'Network & Persistence', status: 'pass', flags: [] }], permissionScopes: [{ name: 'File System Write', detected: false, flags: [] }, { name: 'Network Access', detected: false, flags: [] }, { name: 'Env Variable Access', detected: false, flags: [] }] },
  },
  {
    id: 's01', name: 'Vercel React Best Practices', path: 'vercel-labs/vercel-react-best-practices', installCmd: 'npx skills add https://github.com/vercel-labs/agent-skills --skill vercel-react-best-practices', installs: '197.3K', color: 'bg-neutral-200', icon: '', svg: true, type: 'Engineering', avatar: 'https://unavatar.io/github/vercel', description: '58 performance rules for React + Next.js, prioritized by impact.', github: 'https://github.com/vercel-labs/agent-skills', website: 'https://vercel.com', stars: '22.8K',
    securityScan: { status: 'passed', scannedAt: '2026-03-12T23:11:55.024Z', source: 'README.md', dimensions: [{ name: 'Code Injection', status: 'pass', flags: [] }, { name: 'Data Exfiltration', status: 'pass', flags: [] }, { name: 'Credential Access', status: 'pass', flags: [] }, { name: 'File System Risk', status: 'pass', flags: [] }, { name: 'Network & Persistence', status: 'pass', flags: [] }], permissionScopes: [{ name: 'File System Write', detected: false, flags: [] }, { name: 'Network Access', detected: true, flags: ['https://agentskills.io/', 'https://skill-deploy-abc123.vercel.app', 'https://vercel.com/claim-deployment?code=...'] }, { name: 'Env Variable Access', detected: false, flags: [] }] },
  },
  {
    id: 's02', name: 'Web Design Guidelines', path: 'vercel-labs/web-design-guidelines', installCmd: 'npx skills add https://github.com/vercel-labs/agent-skills --skill web-design-guidelines', installs: '154.8K', color: 'bg-neutral-200', icon: '', svg: true, type: 'Engineering', avatar: 'https://unavatar.io/github/vercel', description: 'Review code for compliance with Web Interface Guidelines.', github: 'https://github.com/vercel-labs/agent-skills', website: 'https://vercel.com', stars: '22.8K',
    securityScan: { status: 'passed', scannedAt: '2026-03-12T23:11:56.133Z', source: 'README.md', dimensions: [{ name: 'Code Injection', status: 'pass', flags: [] }, { name: 'Data Exfiltration', status: 'pass', flags: [] }, { name: 'Credential Access', status: 'pass', flags: [] }, { name: 'File System Risk', status: 'pass', flags: [] }, { name: 'Network & Persistence', status: 'pass', flags: [] }], permissionScopes: [{ name: 'File System Write', detected: false, flags: [] }, { name: 'Network Access', detected: true, flags: ['https://agentskills.io/', 'https://skill-deploy-abc123.vercel.app', 'https://vercel.com/claim-deployment?code=...'] }, { name: 'Env Variable Access', detected: false, flags: [] }] },
  },
  {
    id: 's03', name: 'Frontend Design', path: 'anthropics/frontend-design', installCmd: 'npx skills add https://github.com/anthropics/skills --skill frontend-design', installs: '143.7K', color: 'bg-orange-50', icon: 'FD', type: 'Aesthetic', avatar: 'https://unavatar.io/github/anthropics', description: 'Create distinctive, production-grade frontend interfaces that avoid generic AI aesthetics. Emphasizes working code with meticulous attention to aesthetic details and creative execution.', github: 'https://github.com/anthropics/skills', githubUrl: 'https://github.com/anthropics/skills', website: '', stars: '90.8K',
    dna: { colors: ['#0D0D0D','#E8533F','#F7F7F5'], labels: ['Primary','Accent','Surface'], font1: 'Clash Display', font1Label: 'Display & Heading System', font2: 'Satoshi', font2Label: 'Body & Interface System' },
    securityScan: { status: 'passed', scannedAt: '2026-03-12T23:11:58.045Z', source: 'README.md', dimensions: [{ name: 'Code Injection', status: 'pass', flags: [] }, { name: 'Data Exfiltration', status: 'pass', flags: [] }, { name: 'Credential Access', status: 'pass', flags: [] }, { name: 'File System Risk', status: 'pass', flags: [] }, { name: 'Network & Persistence', status: 'pass', flags: [] }], permissionScopes: [{ name: 'File System Write', detected: false, flags: [] }, { name: 'Network Access', detected: true, flags: ['http://agentskills.io', 'https://support.claude.com/en/articles/12512176-what-are-skills', 'https://support.claude.com/en/articles/12512180-using-skills-in-claude', 'https://support.claude.com/en/articles/12512198-creating-custom-skills'] }, { name: 'Env Variable Access', detected: false, flags: [] }] },
  },
  {
    id: 's04', name: 'Sleek Design', path: 'sleekdotdesign/sleek-design-mobile-apps', installCmd: 'npx skills add https://github.com/sleekdotdesign/agent-skills --skill sleek-design-mobile-apps', installs: '122.5K', color: 'bg-pink-50', icon: 'SD', type: 'Aesthetic', avatar: 'https://unavatar.io/github/sleekdotdesign', description: 'AI-powered mobile application design tool. Create projects, describe designs in natural language, and receive rendered screen outputs via REST API endpoints.', github: 'https://github.com/sleekdotdesign/agent-skills', githubUrl: 'https://github.com/sleekdotdesign/agent-skills', website: 'https://sleek.design', stars: '8',
    dna: { colors: ['#1E1E2E','#A78BFA','#FFFFFF'], labels: ['Background','Primary','Surface'], font1: 'SF Pro Display', font1Label: 'Native Heading System', font2: 'SF Pro Text', font2Label: 'Interface & Body System' },
    securityScan: { status: 'passed', scannedAt: '2026-03-12T23:12:00.697Z', source: 'README.md', dimensions: [{ name: 'Code Injection', status: 'pass', flags: [] }, { name: 'Data Exfiltration', status: 'pass', flags: [] }, { name: 'Credential Access', status: 'pass', flags: [] }, { name: 'File System Risk', status: 'pass', flags: [] }, { name: 'Network & Persistence', status: 'pass', flags: [] }], permissionScopes: [{ name: 'File System Write', detected: false, flags: [] }, { name: 'Network Access', detected: true, flags: ['https://sleek.design', 'https://sleek.design/dashboard/api-keys'] }, { name: 'Env Variable Access', detected: true, flags: ['environment variable'] }] },
  },
  {
    id: 's16', name: 'VaporAviator Lab Style', path: 'VaporAviator/vaporaviator-lab-style', installCmd: 'npx skills add https://github.com/VaporAviator/vaporaviator-lab-style', installs: '22.1K', color: 'bg-black', icon: 'VL', type: 'Aesthetic', avatar: 'https://unavatar.io/twitter/VaporAviator', description: 'Space-Age Minimalist design DNA from VaporAviator Labs. Dark palette, Space Grotesk typography, and Vapor Purple accents — packaged for AI agents to install and execute.', github: 'https://github.com/VaporAviator/vaporaviator-lab-style', githubUrl: 'https://github.com/VaporAviator/vaporaviator-lab-style', website: '', stars: '4.8K', highlighted: true,
    dna: { colors: ['#050505','#9d84ba','#171717'], labels: ['Background','Accent Purple','Surface'], font1: 'Space Grotesk', font1Label: 'Headline & UI System', font2: 'Inter', font2Label: 'Body & Description System' },
    securityScan: { status: 'passed', scannedAt: '2026-03-14T00:00:00.000Z', source: 'SKILL.md', dimensions: [{ name: 'Code Injection', status: 'pass', flags: [] }, { name: 'Data Exfiltration', status: 'pass', flags: [] }, { name: 'Credential Access', status: 'pass', flags: [] }, { name: 'File System Risk', status: 'pass', flags: [] }, { name: 'Network & Persistence', status: 'pass', flags: [] }], permissionScopes: [{ name: 'File System Write', detected: false, flags: [] }, { name: 'Network Access', detected: false, flags: [] }, { name: 'Env Variable Access', detected: false, flags: [] }] },
  },
  {
    id: 's05', name: 'Impeccable', path: 'pbakaus/impeccable', installCmd: 'npx skills add https://github.com/pbakaus/impeccable', installs: '85.2K', color: 'bg-yellow-50', icon: 'IM', type: 'Aesthetic', avatar: 'https://unavatar.io/github/pbakaus', description: 'Enhanced frontend-design skill providing design vocabulary and commands for AI assistants. Includes 17 design commands like /polish, /audit, /distill, and /bolder for AI-driven aesthetics.', github: 'https://github.com/pbakaus/impeccable', githubUrl: 'https://github.com/pbakaus/impeccable', website: 'https://impeccable.style', stars: '3.5K',
    dna: { colors: ['#FDFCFB','#1A1A1A','#E2725B'], labels: ['Canvas','Primary','Accent'], font1: 'Fraunces', font1Label: 'Editorial Heading System', font2: 'Inter', font2Label: 'Functional UI System' },
    securityScan: { status: 'passed', scannedAt: '2026-03-12T23:12:01.316Z', source: 'README.md', dimensions: [{ name: 'Code Injection', status: 'pass', flags: [] }, { name: 'Data Exfiltration', status: 'pass', flags: [] }, { name: 'Credential Access', status: 'pass', flags: [] }, { name: 'File System Risk', status: 'pass', flags: [] }, { name: 'Network & Persistence', status: 'pass', flags: [] }], permissionScopes: [{ name: 'File System Write', detected: false, flags: [] }, { name: 'Network Access', detected: true, flags: ['https://impeccable.style', 'https://impeccable.style#casestudies', 'https://cursor.com/docs/context/skills', 'https://geminicli.com/docs/cli/skills/', 'https://cursor.com', 'https://claude.ai/code', 'https://opencode.ai', 'https://pi.dev'] }, { name: 'Env Variable Access', detected: false, flags: [] }] },
  },
  {
    id: 's06', name: 'Canvas Design', path: 'anthropics/canvas-design', installCmd: 'npx skills add https://github.com/anthropics/skills --skill canvas-design', installs: '17.0K', color: 'bg-orange-50', icon: 'CD', type: 'Aesthetic', avatar: 'https://unavatar.io/github/anthropics', description: 'Create visual design philosophies — aesthetic movements expressed through form, color, composition, and minimal text. Produces museum-quality visual artifacts as PDF or PNG files.', github: 'https://github.com/anthropics/skills', githubUrl: 'https://github.com/anthropics/skills', website: '', stars: '90.8K',
    dna: { colors: ['#F5F0EB','#2D2D2D','#C4956A'], labels: ['Canvas','Charcoal','Bronze'], font1: 'Cormorant Garamond', font1Label: 'Museum Display System', font2: 'Karla', font2Label: 'Caption & Body System' },
    securityScan: { status: 'passed', scannedAt: '2026-03-12T23:12:02.858Z', source: 'README.md', dimensions: [{ name: 'Code Injection', status: 'pass', flags: [] }, { name: 'Data Exfiltration', status: 'pass', flags: [] }, { name: 'Credential Access', status: 'pass', flags: [] }, { name: 'File System Risk', status: 'pass', flags: [] }, { name: 'Network & Persistence', status: 'pass', flags: [] }], permissionScopes: [{ name: 'File System Write', detected: false, flags: [] }, { name: 'Network Access', detected: true, flags: ['http://agentskills.io', 'https://support.claude.com/en/articles/12512176-what-are-skills', 'https://support.claude.com/en/articles/12512180-using-skills-in-claude', 'https://support.claude.com/en/articles/12512198-creating-custom-skills'] }, { name: 'Env Variable Access', detected: false, flags: [] }] },
  },
  {
    id: 's07', name: 'Tailwind Design System', path: 'wshobson/tailwind-design-system', installCmd: 'npx skills add https://github.com/wshobson/agents --skill tailwind-design-system', installs: '16.9K', color: 'bg-blue-50', icon: 'TW', type: 'Engineering', avatar: 'https://unavatar.io/github/wshobson', description: 'Production-ready design systems with Tailwind CSS v4, tokens, CVA.', github: 'https://github.com/wshobson/agents', website: '', stars: '31.0K',
    securityScan: { status: 'warning', scannedAt: '2026-03-12T23:12:03.970Z', source: 'README.md', dimensions: [{ name: 'Code Injection', status: 'pass', flags: [] }, { name: 'Data Exfiltration', status: 'pass', flags: [] }, { name: 'Credential Access', status: 'pass', flags: [] }, { name: 'File System Risk', status: 'warning', flags: ['rm -rf'] }, { name: 'Network & Persistence', status: 'pass', flags: [] }], permissionScopes: [{ name: 'File System Write', detected: true, flags: ['rm -rf'] }, { name: 'Network Access', detected: true, flags: ['https://smithery.ai/badge/skills/wshobson', 'https://smithery.ai/skills?ns=wshobson', 'https://docs.claude.com/en/docs/claude-code/overview', 'https://docs.claude.com/en/docs/claude-code/plugins'] }, { name: 'Env Variable Access', detected: false, flags: [] }] },
  },
  {
    id: 's08', name: 'Building Native UI', path: 'expo/building-native-ui', installCmd: 'npx skills add https://github.com/expo/skills --skill building-native-ui', installs: '16.7K', color: 'bg-violet-50', icon: 'EX', type: 'Engineering', avatar: 'https://unavatar.io/github/expo', description: 'Native iOS interfaces with Expo, Apple HIG standards.', github: 'https://github.com/expo/skills', website: 'https://expo.dev', stars: '1.4K',
    securityScan: { status: 'passed', scannedAt: '2026-03-12T23:12:05.153Z', source: 'README.md', dimensions: [{ name: 'Code Injection', status: 'pass', flags: [] }, { name: 'Data Exfiltration', status: 'pass', flags: [] }, { name: 'Credential Access', status: 'pass', flags: [] }, { name: 'File System Risk', status: 'pass', flags: [] }, { name: 'Network & Persistence', status: 'pass', flags: [] }], permissionScopes: [{ name: 'File System Write', detected: false, flags: [] }, { name: 'Network Access', detected: true, flags: ['https://claude.com/claude-code'] }, { name: 'Env Variable Access', detected: false, flags: [] }] },
  },
  {
    id: 's09', name: 'Design MD', path: 'google-labs-code/design-md', installCmd: 'npx skills add https://github.com/google-labs-code/stitch-skills --skill design-md', installs: '13.6K', color: 'bg-emerald-50', icon: 'DM', type: 'Engineering', avatar: 'https://unavatar.io/github/google-labs-code', description: 'Generate DESIGN.md from Stitch projects for semantic design systems.', github: 'https://github.com/google-labs-code/stitch-skills', website: '', stars: '2.3K',
    securityScan: { status: 'passed', scannedAt: '2026-03-12T23:12:05.891Z', source: 'README.md', dimensions: [{ name: 'Code Injection', status: 'pass', flags: [] }, { name: 'Data Exfiltration', status: 'pass', flags: [] }, { name: 'Credential Access', status: 'pass', flags: [] }, { name: 'File System Risk', status: 'pass', flags: [] }, { name: 'Network & Persistence', status: 'pass', flags: [] }], permissionScopes: [{ name: 'File System Write', detected: false, flags: [] }, { name: 'Network Access', detected: true, flags: ['https://bughunters.google.com/open-source-security'] }, { name: 'Env Variable Access', detected: false, flags: [] }] },
  },
  {
    id: 's10', name: 'Brand Guidelines', path: 'anthropics/brand-guidelines', installCmd: 'npx skills add https://github.com/anthropics/skills --skill brand-guidelines', installs: '12.2K', color: 'bg-orange-50', icon: 'BG', type: 'Aesthetic', avatar: 'https://unavatar.io/github/anthropics', description: 'Access Anthropic\'s official brand identity and style resources. Includes brand color palette, Poppins/Lora typography system, and automatic accent color cycling for designs.', github: 'https://github.com/anthropics/skills', githubUrl: 'https://github.com/anthropics/skills', website: '', stars: '90.8K',
    dna: { colors: ['#D4A27F','#191919','#FAFAF8'], labels: ['Brand Tan','Primary','Surface'], font1: 'Poppins', font1Label: 'Brand Heading System', font2: 'Lora', font2Label: 'Brand Body System' },
    securityScan: { status: 'passed', scannedAt: '2026-03-12T23:12:07.291Z', source: 'README.md', dimensions: [{ name: 'Code Injection', status: 'pass', flags: [] }, { name: 'Data Exfiltration', status: 'pass', flags: [] }, { name: 'Credential Access', status: 'pass', flags: [] }, { name: 'File System Risk', status: 'pass', flags: [] }, { name: 'Network & Persistence', status: 'pass', flags: [] }], permissionScopes: [{ name: 'File System Write', detected: false, flags: [] }, { name: 'Network Access', detected: true, flags: ['http://agentskills.io', 'https://support.claude.com/en/articles/12512176-what-are-skills', 'https://support.claude.com/en/articles/12512180-using-skills-in-claude', 'https://support.claude.com/en/articles/12512198-creating-custom-skills'] }, { name: 'Env Variable Access', detected: false, flags: [] }] },
  },
  {
    id: 's14', name: 'Theme Factory', path: 'anthropics/theme-factory', installCmd: 'npx skills add https://github.com/anthropics/skills --skill theme-factory', installs: '21.4K', color: 'bg-orange-50', icon: 'TF', type: 'Aesthetic', avatar: 'https://unavatar.io/github/anthropics', description: 'Anthropic\'s official theming toolkit for styling artifacts. Apply 10 pre-set professional themes with curated color palettes and font pairings to slides, docs, HTML pages, and any artifact.', github: 'https://github.com/anthropics/skills/tree/main/skills/theme-factory', githubUrl: 'https://github.com/anthropics/skills/tree/main/skills/theme-factory', website: '', stars: '92.7K',
    dna: { colors: ['#1A1A2E','#E94560','#F5F5F5'], labels: ['Deep Navy','Vivid Red','Surface'], font1: 'Playfair Display', font1Label: 'Display Heading System', font2: 'Source Sans Pro', font2Label: 'Body & UI System' },
    securityScan: { status: 'passed', scannedAt: '2026-03-13T19:00:00.000Z', source: 'SKILL.md', dimensions: [{ name: 'Code Injection', status: 'pass', flags: [] }, { name: 'Data Exfiltration', status: 'pass', flags: [] }, { name: 'Credential Access', status: 'pass', flags: [] }, { name: 'File System Risk', status: 'pass', flags: [] }, { name: 'Network & Persistence', status: 'pass', flags: [] }], permissionScopes: [{ name: 'File System Write', detected: false, flags: [] }, { name: 'Network Access', detected: false, flags: [] }, { name: 'Env Variable Access', detected: false, flags: [] }] },
  },
  {
    id: 's12', name: 'Designer Skills Collection', path: 'Owl-Listener/designer-skills', installCmd: 'claude install github:Owl-Listener/designer-skills', installs: '3.2K', color: 'bg-sky-50', icon: 'DS', type: 'Aesthetic', avatar: 'https://unavatar.io/github/Owl-Listener', description: '63 design skills and 27 commands across 8 plugins covering the full design workflow — from user research and systems to UI, interaction design, prototyping, and design ops.', github: 'https://github.com/Owl-Listener/designer-skills', githubUrl: 'https://github.com/Owl-Listener/designer-skills', website: '', stars: '77',
    dna: { colors: ['#0EA5E9','#0F172A','#F8FAFC'], labels: ['Sky Blue','Slate','Surface'], font1: 'Inter', font1Label: 'Interface System', font2: 'Inter', font2Label: 'Body System' },
    securityScan: { status: 'passed', scannedAt: '2026-03-13T17:00:00.000Z', source: 'README.md', dimensions: [{ name: 'Code Injection', status: 'pass', flags: [] }, { name: 'Data Exfiltration', status: 'pass', flags: [] }, { name: 'Credential Access', status: 'pass', flags: [] }, { name: 'File System Risk', status: 'pass', flags: [] }, { name: 'Network & Persistence', status: 'pass', flags: [] }], permissionScopes: [{ name: 'File System Write', detected: false, flags: [] }, { name: 'Network Access', detected: false, flags: [] }, { name: 'Env Variable Access', detected: false, flags: [] }] },
  },
  {
    id: 's13', name: 'UI Design Brain', path: 'carmahhawwari/ui-design-brain', installCmd: 'npx skills add https://github.com/carmahhawwari/ui-design-brain', installs: '8.4K', color: 'bg-indigo-50', icon: 'UB', type: 'Aesthetic', avatar: 'https://unavatar.io/github/carmahhawwari', description: 'A knowledge base of 60+ UI component patterns sourced from component.gallery. Replaces generic AI guessing with real design-system conventions for production-grade, SaaS-quality interfaces.', github: 'https://github.com/carmahhawwari/ui-design-brain', githubUrl: 'https://github.com/carmahhawwari/ui-design-brain', website: '', stars: '576',
    dna: { colors: ['#4F46E5','#1E1B4B','#EEF2FF'], labels: ['Indigo','Deep Indigo','Surface'], font1: 'DM Sans', font1Label: 'Interface Heading System', font2: 'DM Sans', font2Label: 'Body System' },
    securityScan: { status: 'passed', scannedAt: '2026-03-13T17:00:00.000Z', source: 'SKILL.md', dimensions: [{ name: 'Code Injection', status: 'pass', flags: [] }, { name: 'Data Exfiltration', status: 'pass', flags: [] }, { name: 'Credential Access', status: 'pass', flags: [] }, { name: 'File System Risk', status: 'pass', flags: [] }, { name: 'Network & Persistence', status: 'pass', flags: [] }], permissionScopes: [{ name: 'File System Write', detected: false, flags: [] }, { name: 'Network Access', detected: false, flags: [] }, { name: 'Env Variable Access', detected: false, flags: [] }] },
  },
  {
    id: 's11', name: 'Responsive Design Standards', path: 'am-will/frontend-responsive-design-standards', installCmd: 'npx skills add https://github.com/am-will/codex-skills --skill frontend-responsive-design-standards', installs: '5.1K', color: 'bg-amber-50', icon: 'RD', type: 'Engineering', avatar: 'https://unavatar.io/github/am-will', description: 'Mobile-first breakpoints, fluid layouts, touch-friendly targets.', github: 'https://github.com/am-will/codex-skills', website: '', stars: '491',
    securityScan: { status: 'warning', scannedAt: '2026-03-12T23:12:09.710Z', source: 'README.md', dimensions: [{ name: 'Code Injection', status: 'pass', flags: [] }, { name: 'Data Exfiltration', status: 'pass', flags: [] }, { name: 'Credential Access', status: 'warning', flags: ['.env'] }, { name: 'File System Risk', status: 'pass', flags: [] }, { name: 'Network & Persistence', status: 'pass', flags: [] }], permissionScopes: [{ name: 'File System Write', detected: false, flags: [] }, { name: 'Network Access', detected: true, flags: ['https://markdown.new/', 'https://skills.sh'] }, { name: 'Env Variable Access', detected: true, flags: ['.env'] }] },
  },
];

function parseInstalls(str) {
  if (!str) return 0;
  const s = String(str).toUpperCase().trim();
  if (s.endsWith('K')) return parseFloat(s) * 1000;
  if (s.endsWith('M')) return parseFloat(s) * 1000000;
  return parseFloat(s) || 0;
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

    const all = [...submitted, ...SEED_SKILLS];

    // Sort: all skills by installs descending (no highlighted pinning)
    all.sort((a, b) => parseInstalls(b.installs) - parseInstalls(a.installs));

    const numbered = all.map((s, i) => ({ ...s, id: String(i + 1).padStart(2, '0'), githubUrl: s.githubUrl || s.github || '' }));

    return res.status(200).json({ skills: numbered, total: numbered.length });
  } catch (e) {
    // KV not configured — return seed data only
    const seeds = [...SEED_SKILLS].sort((a, b) => parseInstalls(b.installs) - parseInstalls(a.installs));
    const numbered = seeds.map((s, i) => ({ ...s, id: String(i + 1).padStart(2, '0'), githubUrl: s.github || '' }));
    return res.status(200).json({ skills: numbered, total: numbered.length });
  }
};

// Allow other scripts to import SEED_SKILLS directly
module.exports.SEED_SKILLS = SEED_SKILLS;

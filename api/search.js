// Keyword-based search using TF-IDF scoring
// No external API needed — pure JS, works out of the box
// Upgrade path: swap scoreQuery() with an embedding API later

const SKILLS = [
  {id:'s00',name:'VaporAviator Easel Style',description:'Modern high-contrast aesthetic — Instrument Serif + Space Grotesk, monochrome palette, 40px radius system.',type:'Aesthetic',tags:'typography contrast monochrome dark minimal serif grotesk'},
  {id:'s01',name:'Vercel React Best Practices',description:'58 performance rules for React + Next.js, prioritized by impact.',type:'Engineering',tags:'react nextjs performance optimization rules'},
  {id:'s02',name:'Web Design Guidelines',description:'Review code for compliance with Web Interface Guidelines.',type:'Engineering',tags:'web interface guidelines compliance review'},
  {id:'s03',name:'Frontend Design',description:'Distinctive, production-grade frontend interfaces — no generic AI slop.',type:'Aesthetic',tags:'frontend ui production quality distinctive craft'},
  {id:'s04',name:'Sleek Design',description:'AI-powered mobile app design via natural language prompts.',type:'Aesthetic',tags:'mobile app ios android natural language ai prompts sleek'},
  {id:'s05',name:'Impeccable',description:'17 design slash commands for AI-driven frontend aesthetics.',type:'Aesthetic',tags:'slash commands aesthetics frontend ai driven design'},
  {id:'s06',name:'Canvas Design',description:'Visual design philosophies and museum-quality aesthetic artifacts.',type:'Aesthetic',tags:'visual philosophy museum quality artifacts canvas art'},
  {id:'s07',name:'Tailwind Design System',description:'Production-ready design systems with Tailwind CSS v4, tokens, CVA.',type:'Engineering',tags:'tailwind css design system tokens cva components'},
  {id:'s08',name:'Building Native UI',description:'Native iOS interfaces with Expo, Apple HIG standards.',type:'Engineering',tags:'ios native expo apple hig interface standards mobile'},
  {id:'s09',name:'Design MD',description:'Generate DESIGN.md from Stitch projects for semantic design systems.',type:'Engineering',tags:'design documentation semantic stitch generate markdown'},
  {id:'s10',name:'Brand Guidelines',description:'Anthropic brand identity — colors, typography, accent cycling.',type:'Aesthetic',tags:'brand identity colors typography anthropic accent'},
  {id:'s11',name:'Responsive Design Standards',description:'Mobile-first breakpoints, fluid layouts, touch-friendly targets.',type:'Engineering',tags:'responsive mobile breakpoints fluid layout touch accessibility'},
  {id:'s12',name:'Designer Skills Collection',description:'63 design skills across 8 plugins — research, systems, UX strategy, UI, interaction, prototyping, and ops.',type:'Aesthetic',tags:'ux research strategy interaction prototyping systems ops collection'},
  {id:'s13',name:'UI Design Brain',description:'Production-grade UI from 60+ real component patterns — modern, minimal, SaaS-quality.',type:'Aesthetic',tags:'ui components patterns saas modern minimal production quality'},
  {id:'s14',name:'Theme Factory',description:'10 pre-set themes with curated color palettes and font pairings.',type:'Aesthetic',tags:'themes colors palettes fonts typography presets curated'},
  {id:'s15',name:'VaporAviator Lab Style',description:'Research-lab aesthetic for experimental AI interfaces — technical precision meets design craft.',type:'Aesthetic',tags:'research lab experimental ai interface technical precision craft'},
];

// Semantic synonyms to boost recall
const SYNONYMS = {
  urgent: ['error', 'warning', 'danger', 'alert', 'critical'],
  urgency: ['error', 'warning', 'danger', 'alert', 'critical'],
  error: ['warning', 'danger', 'alert', 'destructive'],
  celebrate: ['success', 'achievement', 'confetti', 'milestone'],
  dark: ['contrast', 'monochrome', 'black', 'dark mode'],
  mobile: ['ios', 'native', 'responsive', 'touch', 'app'],
  system: ['tokens', 'components', 'design system', 'guidelines'],
  minimal: ['clean', 'simple', 'minimal', 'sleek'],
  brand: ['identity', 'logo', 'colors', 'typography'],
  type: ['typography', 'font', 'serif', 'grotesk'],
  color: ['palette', 'colors', 'accent', 'theme'],
  fast: ['performance', 'optimization', 'speed'],
  component: ['ui', 'pattern', 'button', 'card'],
  ai: ['agent', 'llm', 'prompt', 'artificial'],
};

function tokenize(text) {
  return text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 1);
}

function expandQuery(tokens) {
  const expanded = new Set(tokens);
  for (const token of tokens) {
    const syns = SYNONYMS[token] || [];
    for (const syn of syns) tokenize(syn).forEach(t => expanded.add(t));
  }
  return [...expanded];
}

function scoreSkill(skill, queryTokens) {
  const text = `${skill.name} ${skill.name} ${skill.description} ${skill.type} ${skill.tags || ''}`.toLowerCase();
  const skillTokens = tokenize(text);
  const skillSet = new Set(skillTokens);

  let score = 0;
  for (const qt of queryTokens) {
    if (skillSet.has(qt)) {
      // Boost for name matches
      if (skill.name.toLowerCase().includes(qt)) score += 3;
      else if (skill.type.toLowerCase().includes(qt)) score += 2;
      else score += 1;
    }
    // Partial match (substring)
    if (text.includes(qt) && !skillSet.has(qt)) score += 0.5;
  }

  // Normalize by query length
  return score / Math.max(queryTokens.length, 1);
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

  const rawTokens = tokenize(query.trim());
  const queryTokens = expandQuery(rawTokens);

  const results = SKILLS
    .map(skill => ({
      skill_id: skill.id,
      name: skill.name,
      description: skill.description,
      type: skill.type,
      similarity: scoreSkill(skill, queryTokens),
    }))
    .filter(r => r.similarity > 0)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 8);

  return res.status(200).json({ results, query });
};

// Hybrid search: exact keyword match (fonts, colors, names) + Jina semantic search
const KV_URL = process.env.KV_REST_API_URL;
const KV_TOKEN = process.env.KV_REST_API_TOKEN;
const JINA_API_KEY = process.env.JINA_API_KEY;

// All DNA data for keyword matching — same source as skill-detail.html
const SKILL_DNA = {
  'vaporaviator/easel-style': {
    colors: ['#f9f9f9','#000000','#ffffff'], colorWords: ['black','white','monochrome','grayscale','dark','high-contrast'],
    fonts: ['Instrument Serif','Space Grotesk'], author: 'VaporAviator',
  },
  'anthropics/frontend-design': {
    colors: ['#0D0D0D','#E8533F','#F7F7F5'], colorWords: ['red','coral','charcoal','dark','warm'],
    fonts: ['Clash Display','Satoshi'], author: 'Anthropic',
  },
  'sleekdotdesign/sleek-design-mobile-apps': {
    colors: ['#1E1E2E','#A78BFA','#FFFFFF'], colorWords: ['purple','violet','lavender','dark'],
    fonts: ['SF Pro Display','SF Pro Text','SF Pro'], author: 'Sleek Design',
  },
  'pbakaus/impeccable': {
    colors: ['#FDFCFB','#1A1A1A','#E2725B'], colorWords: ['cream','coral','terra cotta','warm','dark'],
    fonts: ['Fraunces','Inter'], author: 'Paul Bakaus',
  },
  'anthropics/canvas-design': {
    colors: ['#F5F0EB','#2D2D2D','#C4956A'], colorWords: ['beige','bronze','charcoal','earthy','warm'],
    fonts: ['Cormorant Garamond','Karla'], author: 'Anthropic',
  },
  'anthropics/brand-guidelines': {
    colors: ['#D4A27F','#191919','#FAFAF8'], colorWords: ['tan','copper','cream','dark','warm'],
    fonts: ['Poppins','Lora'], author: 'Anthropic',
  },
  'VaporAviator/vaporaviator-lab-style': {
    colors: ['#050505','#9d84ba','#171717'], colorWords: ['purple','violet','lavender','dark','space'],
    fonts: ['Space Grotesk','Inter'], author: 'VaporAviator',
  },
  'anthropics/theme-factory': {
    colors: ['#1A1A2E','#E94560','#F5F5F5'], colorWords: ['navy','red','pink','dark','vivid'],
    fonts: ['Playfair Display','Source Sans Pro'], author: 'Anthropic',
  },
  'Owl-Listener/designer-skills': {
    colors: ['#0EA5E9','#0F172A','#F8FAFC'], colorWords: ['blue','sky blue','slate','light'],
    fonts: ['Inter'], author: 'Owl-Listener',
  },
  'carmahhawwari/ui-design-brain': {
    colors: ['#4F46E5','#1E1B4B','#EEF2FF'], colorWords: ['indigo','purple','violet','deep','dark'],
    fonts: ['DM Sans'], author: 'carmahhawwari',
  },
  'wshobson/tailwind-design-system': {
    colors: [], colorWords: ['tailwind','css','tokens'],
    fonts: [], author: 'Hobson',
  },
  'expo/building-native-ui': {
    colors: [], colorWords: ['ios','apple','native'],
    fonts: ['San Francisco','SF Pro'], author: 'Expo',
  },
  'vercel-labs/vercel-react-best-practices': {
    colors: [], colorWords: [],
    fonts: [], author: 'Vercel',
  },
  'vercel-labs/web-design-guidelines': {
    colors: [], colorWords: [],
    fonts: [], author: 'Vercel',
  },
  'google-labs-code/design-md': {
    colors: [], colorWords: [],
    fonts: [], author: 'Google Labs',
  },
  'am-will/frontend-responsive-design-standards': {
    colors: [], colorWords: ['responsive','mobile'],
    fonts: [], author: 'am-will',
  },
};

// All skills metadata for returning results
const SKILL_META = {
  'vaporaviator/easel-style': { id:'s00', name:'VaporAviator Easel Style', type:'Aesthetic', installs:'85.5K', desc:'Modern high-contrast aesthetic — Instrument Serif + Space Grotesk, monochrome palette, 40px radius system.' },
  'vercel-labs/vercel-react-best-practices': { id:'s01', name:'Vercel React Best Practices', type:'Engineering', installs:'197.3K', desc:'58 performance rules for React + Next.js, prioritized by impact.' },
  'vercel-labs/web-design-guidelines': { id:'s02', name:'Web Design Guidelines', type:'Engineering', installs:'154.8K', desc:'Review code for compliance with Web Interface Guidelines.' },
  'anthropics/frontend-design': { id:'s03', name:'Frontend Design', type:'Aesthetic', installs:'143.7K', desc:'Distinctive, production-grade frontend interfaces — no generic AI slop.' },
  'sleekdotdesign/sleek-design-mobile-apps': { id:'s04', name:'Sleek Design', type:'Aesthetic', installs:'122.5K', desc:'AI-powered mobile app design via natural language prompts.' },
  'pbakaus/impeccable': { id:'s05', name:'Impeccable', type:'Aesthetic', installs:'85.2K', desc:'17 design slash commands for AI-driven frontend aesthetics.' },
  'anthropics/canvas-design': { id:'s06', name:'Canvas Design', type:'Aesthetic', installs:'17.0K', desc:'Visual design philosophies and museum-quality aesthetic artifacts.' },
  'wshobson/tailwind-design-system': { id:'s07', name:'Tailwind Design System', type:'Engineering', installs:'16.9K', desc:'Production-ready design systems with Tailwind CSS v4, tokens, CVA.' },
  'expo/building-native-ui': { id:'s08', name:'Building Native UI', type:'Engineering', installs:'16.7K', desc:'Native iOS interfaces with Expo, Apple HIG standards.' },
  'google-labs-code/design-md': { id:'s09', name:'Design MD', type:'Engineering', installs:'13.6K', desc:'Generate DESIGN.md from Stitch projects for semantic design systems.' },
  'anthropics/brand-guidelines': { id:'s10', name:'Brand Guidelines', type:'Aesthetic', installs:'12.2K', desc:'Anthropic brand identity — colors, typography, accent cycling.' },
  'am-will/frontend-responsive-design-standards': { id:'s11', name:'Responsive Design Standards', type:'Engineering', installs:'5.1K', desc:'Mobile-first breakpoints, fluid layouts, touch-friendly targets.' },
  'Owl-Listener/designer-skills': { id:'s12', name:'Designer Skills Collection', type:'Aesthetic', installs:'3.2K', desc:'63 design skills across 8 plugins.' },
  'carmahhawwari/ui-design-brain': { id:'s13', name:'UI Design Brain', type:'Aesthetic', installs:'8.4K', desc:'Production-grade UI from 60+ real component patterns.' },
  'anthropics/theme-factory': { id:'s14', name:'Theme Factory', type:'Aesthetic', installs:'21.4K', desc:'10 pre-set themes with curated color palettes and font pairings.' },
  'VaporAviator/vaporaviator-lab-style': { id:'s15', name:'VaporAviator Lab Style', type:'Aesthetic', installs:'1.2K', desc:'Research-lab aesthetic for experimental AI interfaces.' },
};

function keywordSearch(query) {
  const q = query.toLowerCase().trim();
  const results = [];

  for (const [path, dna] of Object.entries(SKILL_DNA)) {
    const meta = SKILL_META[path];
    if (!meta) continue;

    let score = 0;

    // Font match (case-insensitive)
    for (const font of dna.fonts) {
      if (q.includes(font.toLowerCase()) || font.toLowerCase().includes(q)) {
        score = Math.max(score, 0.9);
      }
    }

    // Color hex match
    for (const hex of dna.colors) {
      if (q.includes(hex.toLowerCase())) {
        score = Math.max(score, 0.85);
      }
    }

    // Color word match
    for (const word of dna.colorWords) {
      if (q.includes(word.toLowerCase()) || word.toLowerCase().includes(q)) {
        score = Math.max(score, 0.7);
      }
    }

    // Author match
    if (dna.author && (q.includes(dna.author.toLowerCase()) || dna.author.toLowerCase().includes(q))) {
      score = Math.max(score, 0.8);
    }

    // Name match
    if (meta.name.toLowerCase().includes(q) || q.includes(meta.name.toLowerCase())) {
      score = Math.max(score, 0.95);
    }

    if (score > 0) {
      results.push({
        skill_id: meta.id, name: meta.name, description: meta.desc,
        type: meta.type, path, installs: meta.installs, similarity: score,
      });
    }
  }

  return results.sort((a, b) => b.similarity - a.similarity);
}

// KV + Jina functions for semantic search
async function kvGet(key) {
  const res = await fetch(`${KV_URL}/get/${encodeURIComponent(key)}`, {
    headers: { Authorization: `Bearer ${KV_TOKEN}` },
  });
  const data = await res.json();
  if (!data.result) return null;
  let val = data.result;
  if (typeof val === 'string') { try { val = JSON.parse(val); } catch(e) { return null; } }
  if (typeof val === 'string') { try { val = JSON.parse(val); } catch(e) { return null; } }
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
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${JINA_API_KEY}` },
    body: JSON.stringify({ model: 'jina-embeddings-v3', input: [text], task: 'retrieval.query' }),
  });
  if (!res.ok) throw new Error(`Jina API error: ${res.status}`);
  const data = await res.json();
  return data.data[0].embedding;
}

function cosineSimilarity(a, b) {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) { dot += a[i]*b[i]; normA += a[i]*a[i]; normB += b[i]*b[i]; }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

async function semanticSearch(query) {
  if (!JINA_API_KEY) return [];
  try {
    const queryEmbed = await getEmbedding(query);
    const keys = await kvKeys('jina:*');
    if (!keys.length) return [];

    const results = [];
    await Promise.all(keys.map(async (key) => {
      try {
        const record = await kvGet(key);
        if (!record?.embedding) return;
        const score = cosineSimilarity(queryEmbed, record.embedding);
        if (score > 0.20) {
          results.push({
            skill_id: record.id, name: record.name, description: record.description,
            type: record.type, path: record.path, installs: record.installs, similarity: score,
          });
        }
      } catch (_) {}
    }));
    return results;
  } catch (e) { return []; }
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

  try {
    // Layer 1: exact keyword/DNA match (fonts, colors, author, name)
    const kwResults = keywordSearch(query.trim());

    // If keyword match found confident results, return those only
    // This avoids semantic noise polluting exact matches
    if (kwResults.length > 0) {
      return res.status(200).json({ results: kwResults.slice(0, 8), query });
    }

    // Layer 2: fall back to Jina semantic search only when no keyword match
    const semResults = await semanticSearch(query.trim());
    return res.status(200).json({ results: semResults.slice(0, 8), query });
  } catch (err) {
    console.error('Search error:', err);
    return res.status(500).json({ error: err.message });
  }
};

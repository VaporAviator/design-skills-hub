module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { githubUrl } = req.body || {};
  if (!githubUrl) return res.status(400).json({ error: 'GitHub URL required.' });

  const match = githubUrl.match(/github\.com\/([^\/]+)\/([^\/\?\#]+)/);
  if (!match) return res.status(400).json({ error: 'Invalid GitHub URL.' });

  const owner = match[1];
  const repo = match[2].replace(/\.git$/, '');
  const headers = { 'User-Agent': 'DesignSkillsHub/1.0', Accept: 'application/vnd.github.v3+json' };

  try {
    // Fetch repo info + README + SKILL.md in parallel
    const [repoRes, readmeRes, skillRes] = await Promise.allSettled([
      fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers }),
      fetch(`https://raw.githubusercontent.com/${owner}/${repo}/main/README.md`, { headers }),
      fetch(`https://raw.githubusercontent.com/${owner}/${repo}/main/SKILL.md`, { headers }),
    ]);

    let repoData = {};
    if (repoRes.status === 'fulfilled' && repoRes.value.ok) {
      repoData = await repoRes.value.json();
    }

    let readmeText = '';
    if (readmeRes.status === 'fulfilled' && readmeRes.value.ok) {
      readmeText = await readmeRes.value.text();
    }

    let skillText = '';
    if (skillRes.status === 'fulfilled' && skillRes.value.ok) {
      skillText = await skillRes.value.text();
    }

    // Extract useful info
    const name = formatRepoName(repoData.name || repo);
    const repoDescription = repoData.description || '';
    const topics = repoData.topics || [];
    const language = repoData.language || '';
    const stars = repoData.stargazers_count || 0;

    // Build description from best available source
    let description = '';

    // Priority 1: SKILL.md — extract first meaningful paragraph
    if (skillText) {
      description = extractFirstParagraph(skillText);
    }

    // Priority 2: README first paragraph
    if (!description && readmeText) {
      description = extractFirstParagraph(readmeText);
    }

    // Priority 3: GitHub repo description
    if (!description && repoDescription) {
      description = repoDescription;
    }

    // Truncate to reasonable length
    if (description.length > 200) {
      description = description.slice(0, 197) + '...';
    }

    // Guess category from topics/language
    const category = guessCategory(topics, language, skillText + readmeText);

    return res.status(200).json({
      name,
      description,
      category,
      topics,
      language,
      stars,
      owner,
      avatar: `https://unavatar.io/github/${owner}`,
    });
  } catch (e) {
    console.error('Fetch repo error:', e);
    return res.status(500).json({ error: 'Failed to fetch repository info.' });
  }
};

function formatRepoName(name) {
  // "my-cool-skill" → "My Cool Skill"
  return name
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

function extractFirstParagraph(markdown) {
  const lines = markdown.split('\n');
  let paragraph = '';
  let foundContent = false;

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip headings, badges, images, HTML, empty lines before content
    if (!foundContent) {
      if (
        !trimmed ||
        trimmed.startsWith('#') ||
        trimmed.startsWith('![') ||
        trimmed.startsWith('<') ||
        trimmed.startsWith('[![') ||
        trimmed.startsWith('---') ||
        trimmed.startsWith('```')
      ) continue;
      foundContent = true;
    }

    // Stop at next heading, empty line after content, or code block
    if (foundContent && (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('```'))) {
      break;
    }

    paragraph += (paragraph ? ' ' : '') + trimmed;
  }

  // Clean up markdown formatting
  return paragraph
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')  // [text](url) → text
    .replace(/\*\*([^*]+)\*\*/g, '$1')          // **bold** → bold
    .replace(/\*([^*]+)\*/g, '$1')              // *italic* → italic
    .replace(/`([^`]+)`/g, '$1')                // `code` → code
    .trim();
}

function guessCategory(topics, language, content) {
  const text = [...topics, language, content.slice(0, 1000)].join(' ').toLowerCase();

  const categorySignals = {
    'Design System': ['design-system', 'design system', 'components', 'ui kit', 'tokens', 'figma'],
    'Brand Identity': ['brand', 'branding', 'logo', 'identity'],
    'Typography System': ['typography', 'fonts', 'typeface', 'type-system'],
    'Color Palette': ['color', 'palette', 'theme', 'colors'],
    'Layout & Grid': ['layout', 'grid', 'spacing', 'responsive'],
    'Motion & Animation': ['motion', 'animation', 'transition', 'framer-motion', 'gsap'],
    'Dark Mode': ['dark-mode', 'dark mode', 'theme-toggle'],
    'Framework Specs': ['framework', 'nextjs', 'react', 'vue', 'svelte', 'angular'],
    'Component Architecture': ['component', 'architecture', 'atomic', 'pattern'],
    'Performance Rules': ['performance', 'optimization', 'lighthouse', 'web-vitals'],
    'Accessibility & A11y': ['accessibility', 'a11y', 'wcag', 'aria', 'screen-reader'],
    'Code Style & Linting': ['eslint', 'prettier', 'linting', 'code-style', 'styleguide'],
  };

  let bestMatch = '';
  let bestScore = 0;

  for (const [category, signals] of Object.entries(categorySignals)) {
    const score = signals.filter(s => text.includes(s)).length;
    if (score > bestScore) {
      bestScore = score;
      bestMatch = category;
    }
  }

  return bestMatch || '';
}

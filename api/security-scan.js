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
        // Hidden commands
        /\bos\.system\s*\(/gi,
        /\bsubprocess\b/gi,
        /\bshell_exec\s*\(/gi,
        /\bsystem\s*\(/gi,
        /\b__import__\s*\(/gi,
        /\\x[0-9a-f]{2}/gi,
        /\\u[0-9a-f]{4}/gi,
        /String\.fromCharCode/gi,
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
        // Data collection — clipboard
        /navigator\.clipboard/gi,
        /\bpbcopy\b/gi,
        /\bxclip\b/gi,
        /\bclipboard\b/gi,
        // Data collection — keylogging
        /\bkeydown\b.*\b(send|post|fetch|ajax)\b/gi,
        /\bkeypress\b.*\b(send|post|fetch|ajax)\b/gi,
        /\bkeyup\b.*\b(send|post|fetch|ajax)\b/gi,
        // Data collection — screen capture
        /\bscreenshot\b/gi,
        /screen\.capture/gi,
        /\bhtml2canvas\b/gi,
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
        // Privilege escalation — Docker escape
        /\bdocker\s+run\b/gi,
        /--privileged\b/gi,
        /-v\s+\/:/gi,
        // Privilege escalation — SSH
        /\bssh-keygen\b/gi,
        /authorized_keys/gi,
        /\bid_rsa\b/gi,
        // Privilege escalation — sudo installs
        /\bsudo\s+npm\b/gi,
        /\bsudo\s+pip\b/gi,
        /\bsudo\s+apt\b/gi,
      ],
    },
    {
      name: 'Prompt Injection',
      patterns: [
        // System prompt override attempts
        /ignore\s+(all\s+)?previous\s+(instructions?|prompts?)/gi,
        /disregard\s+(all\s+)?(previous\s+)?instructions?/gi,
        /you\s+are\s+now\b/gi,
        /new\s+role\s*:/gi,
        /forget\s+everything/gi,
        // Role manipulation
        /act\s+as\s+(a\s+)?/gi,
        /pretend\s+to\s+be\b/gi,
        /switch\s+to\s+(a\s+)?/gi,
        /override\s+safety/gi,
        // Hidden instructions in markdown
        /<!--.*?(run|exec|ignore|override|system|prompt).*?-->/gis,
        /\u200b|\u200c|\u200d|\ufeff/g,
      ],
    },
    {
      name: 'Supply Chain',
      patterns: [
        // Post-install scripts
        /["']?(pre|post)install["']?\s*:/gi,
        // Dynamic requires
        /require\s*\(\s*[a-zA-Z_$][a-zA-Z0-9_$]*\s*\)/gi,
        /require\s*\(\s*`/gi,
        // Typosquatting indicators (common misspellings of popular packages)
        /\blodahs\b|\blodash[-_]es\b/gi,
        /\bchalck\b|\bchalk[-_]js\b/gi,
        /\baxois\b|\baxio\b/gi,
        /\brequets\b|\brequst\b/gi,
        /\bnoed-fetch\b|\bnode-fech\b/gi,
        /\bcross-env\b.*\bcross-env\b/gi,
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

  // --- Permission Scope Detection ---
  const permissionScopes = [];

  // File System Write
  const fsWritePatterns = [
    /fs\.(write|writeFile|writeFileSync|appendFile|createWriteStream)\b/gi,
    /fs\.(unlink|rmdir|rm|rename|mkdir)\b/gi,
    /\brm\s+-rf\b/gi,
    /\bchmod\b/gi,
    /\bchown\b/gi,
    />\s*\/[a-z]/gi,
    /write\s*(to\s+)?(file|disk|directory|folder)/gi,
    /create\s+(file|directory|folder)/gi,
    /save\s+(to\s+)?(file|disk|local)/gi,
    /modify\s+(file|directory)/gi,
  ];
  const fsMatches = [];
  for (const p of fsWritePatterns) {
    const m = text.match(p);
    if (m) fsMatches.push(...m.map(x => x.trim()));
  }
  permissionScopes.push({
    name: 'File System Write',
    detected: fsMatches.length > 0,
    flags: [...new Set(fsMatches)],
  });

  // Network Access
  const netPatterns = [
    /\bfetch\s*\(/gi,
    /\bcurl\s+/gi,
    /\bwget\s+/gi,
    /XMLHttpRequest/gi,
    /navigator\.sendBeacon/gi,
    /https?:\/\/(?!github\.com|raw\.githubusercontent\.com)[^\s"'`)\]]+/gi,
    /\baxios\b/gi,
    /\brequests?\.(get|post|put|delete|patch)\b/gi,
    /external\s+(api|server|endpoint|service|url)/gi,
    /send\s+(data|request|payload)\s+(to|via)/gi,
  ];
  const netMatches = [];
  for (const p of netPatterns) {
    const m = text.match(p);
    if (m) netMatches.push(...m.map(x => x.trim()));
  }
  permissionScopes.push({
    name: 'Network Access',
    detected: netMatches.length > 0,
    flags: [...new Set(netMatches)].slice(0, 8),
  });

  // Environment Variable Reading
  const envPatterns = [
    /process\.env\b/gi,
    /\bAPI[_-]?KEY\b/gi,
    /\bSECRET[_-]?KEY\b/gi,
    /\bACCESS[_-]?TOKEN\b/gi,
    /\.env\b/gi,
    /\benvironment\s+variable/gi,
    /\benv\s+var/gi,
    /\bos\.environ/gi,
    /\bgetenv\b/gi,
  ];
  const envMatches = [];
  for (const p of envPatterns) {
    const m = text.match(p);
    if (m) envMatches.push(...m.map(x => x.trim()));
  }
  permissionScopes.push({
    name: 'Env Variable Access',
    detected: envMatches.length > 0,
    flags: [...new Set(envMatches)],
  });

  // Clipboard Access
  const clipPatterns = [
    /navigator\.clipboard/gi,
    /\bclipboard\b/gi,
    /\bpbcopy\b/gi,
    /\bpbpaste\b/gi,
    /\bxclip\b/gi,
    /\bxsel\b/gi,
    /clipboard\.(read|write|readText|writeText)/gi,
  ];
  const clipMatches = [];
  for (const p of clipPatterns) {
    const m = text.match(p);
    if (m) clipMatches.push(...m.map(x => x.trim()));
  }
  permissionScopes.push({
    name: 'Clipboard Access',
    detected: clipMatches.length > 0,
    flags: [...new Set(clipMatches)],
  });

  // Process Spawning
  const procPatterns = [
    /child_process/gi,
    /\bspawn\s*\(/gi,
    /\bexecSync\s*\(/gi,
    /\bexecFile\s*\(/gi,
    /\bfork\s*\(/gi,
    /\bexec\s*\(/gi,
    /\bsubprocess\b/gi,
    /\bos\.system\s*\(/gi,
    /\bshell_exec\s*\(/gi,
    /\bpopen\s*\(/gi,
  ];
  const procMatches = [];
  for (const p of procPatterns) {
    const m = text.match(p);
    if (m) procMatches.push(...m.map(x => x.trim()));
  }
  permissionScopes.push({
    name: 'Process Spawning',
    detected: procMatches.length > 0,
    flags: [...new Set(procMatches)],
  });

  return {
    status: overall,
    dimensions: results,
    permissionScopes,
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

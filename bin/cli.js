#!/usr/bin/env node

const readline = require('readline');
const fs = require('fs');
const path = require('path');
const os = require('os');

const API_URL = 'https://designskills.xyz/api/skills';
const SKILLS_DIR = path.join(os.homedir(), '.claude', 'skills');

// ── Helpers ──────────────────────────────────────────────────

function dim(s) { return `\x1b[2m${s}\x1b[0m`; }
function bold(s) { return `\x1b[1m${s}\x1b[0m`; }
function green(s) { return `\x1b[32m${s}\x1b[0m`; }
function yellow(s) { return `\x1b[33m${s}\x1b[0m`; }
function cyan(s) { return `\x1b[36m${s}\x1b[0m`; }
function red(s) { return `\x1b[31m${s}\x1b[0m`; }

function ask(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => rl.question(question, ans => { rl.close(); resolve(ans.trim()); }));
}

// ── Fetch skill content from GitHub ──────────────────────────

async function fetchSkillMd(githubUrl, skillPath) {
  const match = githubUrl.match(/github\.com\/([^\/]+)\/([^\/\?\#]+)/);
  if (!match) return null;

  const [, owner, repo] = match;
  const cleanRepo = repo.replace(/\.git$/, '');
  const base = `https://raw.githubusercontent.com/${owner}/${cleanRepo}/main`;

  // Derive subpath: if skill path differs from repo path
  const repoPath = `${owner}/${cleanRepo}`.toLowerCase();
  const parts = skillPath.split('/');
  const subpath = parts.length > 1 && repoPath !== skillPath.toLowerCase() ? parts.slice(1).join('/') : null;

  const urls = [];
  if (subpath) {
    urls.push(`${base}/${subpath}/SKILL.md`);
  }
  urls.push(`${base}/SKILL.md`);
  if (subpath) {
    urls.push(`${base}/${subpath}/README.md`);
  }
  urls.push(`${base}/README.md`);

  for (const url of urls) {
    try {
      const r = await fetch(url, { headers: { 'User-Agent': 'design-skills-hub-cli/1.0' } });
      if (r.ok) {
        const text = await r.text();
        if (text && text.trim().length > 50) return text;
      }
    } catch (_) {}
  }
  return null;
}

// ── Install a skill ──────────────────────────────────────────

async function installSkill(skill) {
  const name = skill.path.split('/').pop();
  const dir = path.join(SKILLS_DIR, name);

  process.stdout.write(dim(`  Fetching ${skill.name}...`));

  const content = await fetchSkillMd(skill.github, skill.path);
  if (!content) {
    console.log(red(' failed'));
    console.log(red(`  Could not fetch SKILL.md from ${skill.github}`));
    return false;
  }

  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'SKILL.md'), content, 'utf-8');

  console.log(green(' done'));
  console.log(green(`  ✓ Installed to ~/.claude/skills/${name}/SKILL.md`));
  return true;
}

// ── Main ─────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);

  // Header
  console.log('');
  console.log(bold('  Design Skills Hub') + dim('  designskills.xyz'));
  console.log(dim('  ─────────────────────────────────────'));

  // Fetch skills
  let skills;
  try {
    const res = await fetch(API_URL);
    const data = await res.json();
    skills = data.skills || [];
  } catch (e) {
    console.log(red('\n  Failed to fetch skills. Check your network.\n'));
    process.exit(1);
  }

  if (skills.length === 0) {
    console.log(yellow('\n  No skills available.\n'));
    process.exit(0);
  }

  // Direct install: npx design-skills-hub <path>
  if (args.length > 0) {
    const query = args.join(' ').toLowerCase();
    const match = skills.find(s =>
      s.path.toLowerCase() === query ||
      s.name.toLowerCase() === query ||
      s.path.toLowerCase().endsWith('/' + query)
    );
    if (!match) {
      console.log(red(`\n  Skill not found: "${args.join(' ')}"\n`));
      console.log(dim('  Run without arguments to browse all skills.\n'));
      process.exit(1);
    }
    console.log('');
    await installSkill(match);
    console.log('');
    process.exit(0);
  }

  // Interactive mode
  console.log('');
  skills.forEach((s, i) => {
    const num = String(i + 1).padStart(2, ' ');
    const badge = s.securityScan?.status === 'warning' ? yellow('⚠') : green('✓');
    const installs = dim(s.installs || '');
    console.log(`  ${dim(num)}  ${badge}  ${bold(s.name)}  ${installs}`);
    console.log(`      ${dim(s.description || '')}`);
  });

  console.log('');
  const answer = await ask(dim('  Enter number to install (or q to quit): '));

  if (!answer || answer.toLowerCase() === 'q') {
    console.log(dim('\n  Bye!\n'));
    process.exit(0);
  }

  const idx = parseInt(answer, 10) - 1;
  if (isNaN(idx) || idx < 0 || idx >= skills.length) {
    console.log(red('\n  Invalid selection.\n'));
    process.exit(1);
  }

  // Confirm
  const skill = skills[idx];
  console.log('');
  console.log(`  ${bold(skill.name)}`);
  console.log(`  ${dim(skill.description || '')}`);
  console.log(`  ${dim(skill.github)}`);
  console.log('');

  const confirm = await ask(`  Install to ${cyan('~/.claude/skills/')}? ${dim('(Y/n) ')}`);
  if (confirm && confirm.toLowerCase() !== 'y' && confirm.toLowerCase() !== 'yes' && confirm !== '') {
    console.log(dim('\n  Cancelled.\n'));
    process.exit(0);
  }

  console.log('');
  const ok = await installSkill(skill);
  if (ok) {
    console.log(dim(`\n  Restart Claude Code to activate the skill.\n`));
  }
  console.log('');
}

main().catch(e => {
  console.error(red(`\n  Error: ${e.message}\n`));
  process.exit(1);
});

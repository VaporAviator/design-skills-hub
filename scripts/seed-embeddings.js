#!/usr/bin/env node
// One-time script: generate embeddings for all existing skills and upsert to Supabase
// Run: GOOGLE_API_KEY=xxx SUPABASE_URL=xxx SUPABASE_SERVICE_KEY=xxx node scripts/seed-embeddings.js

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

const { SEED_SKILLS } = require('../api/skills');

async function getEmbedding(text) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${GOOGLE_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'models/gemini-embedding-001',
        content: { parts: [{ text }] },
      }),
    }
  );
  if (!res.ok) throw new Error(`Embedding error: ${res.status} ${await res.text()}`);
  const data = await res.json();
  return data.embedding.values;
}

function buildEmbedText(skill) {
  const parts = [
    skill.name,
    skill.description,
    skill.type || '',
    skill.tags ? skill.tags.join(' ') : '',
  ];
  return parts.filter(Boolean).join(' ').trim();
}

async function upsertSkill(skill, embedding) {
  const body = {
    skill_id: skill.id,
    name: skill.name,
    description: skill.description,
    type: skill.type || null,
    github: skill.github || null,
    install_cmd: skill.installCmd || null,
    embedding,
  };

  const res = await fetch(`${SUPABASE_URL}/rest/v1/skills`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      Prefer: 'resolution=merge-duplicates',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error(`Upsert error: ${res.status} ${await res.text()}`);
  return res;
}

async function main() {
  if (!SUPABASE_URL || !SUPABASE_KEY || !GOOGLE_API_KEY) {
    console.error('Missing env vars: SUPABASE_URL, SUPABASE_SERVICE_KEY, GOOGLE_API_KEY');
    process.exit(1);
  }

  console.log(`Processing ${SEED_SKILLS.length} skills...`);

  for (const skill of SEED_SKILLS) {
    try {
      const text = buildEmbedText(skill);
      console.log(`[${skill.id}] Embedding: "${text.slice(0, 60)}..."`);
      const embedding = await getEmbedding(text);
      await upsertSkill(skill, embedding);
      console.log(`[${skill.id}] ✅ Done`);
      // Small delay to avoid rate limits
      await new Promise(r => setTimeout(r, 200));
    } catch (err) {
      console.error(`[${skill.id}] ❌ Error:`, err.message);
    }
  }

  console.log('Done!');
}

main();

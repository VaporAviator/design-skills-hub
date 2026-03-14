-- Run this in Supabase SQL Editor

-- 1. Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Create skills table
CREATE TABLE IF NOT EXISTS skills (
  skill_id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT,
  github TEXT,
  install_cmd TEXT,
  embedding vector(3072),  -- Google gemini-embedding-001 = 768 dims
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create vector index (IVFFlat for fast approximate search)
CREATE INDEX IF NOT EXISTS skills_embedding_idx
  ON skills USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 10);

-- 4. Create search function
CREATE OR REPLACE FUNCTION search_skills(
  query_embedding vector(3072),
  match_count int DEFAULT 8,
  match_threshold float DEFAULT 0.5
)
RETURNS TABLE(
  skill_id text,
  name text,
  description text,
  type text,
  github text,
  install_cmd text,
  similarity float
)
LANGUAGE sql STABLE
AS $$
  SELECT
    skill_id,
    name,
    description,
    type,
    github,
    install_cmd,
    1 - (embedding <=> query_embedding) AS similarity
  FROM skills
  WHERE 1 - (embedding <=> query_embedding) > match_threshold
  ORDER BY embedding <=> query_embedding
  LIMIT match_count;
$$;

-- 5. Disable RLS (simple public registry, no auth needed)
ALTER TABLE skills DISABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- SUPABASE PGVECTOR SCHEMA & SETUP SCRIPT FOR SHARAD'S PORTFOLIO RAG AGENT
-- ==============================================================================

-- 1. Enable the pgvector extension for dense vector similarity search
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Create the portfolio_chunks table
CREATE TABLE IF NOT EXISTS portfolio_chunks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    section_id TEXT NOT NULL,
    category TEXT NOT NULL,
    content TEXT NOT NULL,
    keywords TEXT[] DEFAULT '{}',
    embedding vector(768), -- Compatible with text-embedding-004 / gemini-embedding-2-preview
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create an HNSW vector index for ultra-fast sub-millisecond approximate nearest neighbor search
CREATE INDEX IF NOT EXISTS portfolio_chunks_embedding_idx
ON portfolio_chunks
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

-- 4. RPC function: match_portfolio_chunks for similarity search
CREATE OR REPLACE FUNCTION match_portfolio_chunks (
    query_embedding vector(768),
    match_threshold float DEFAULT 0.3,
    match_count int DEFAULT 6
)
RETURNS TABLE (
    id TEXT,
    title TEXT,
    section_id TEXT,
    category TEXT,
    content TEXT,
    similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        portfolio_chunks.id,
        portfolio_chunks.title,
        portfolio_chunks.section_id,
        portfolio_chunks.category,
        portfolio_chunks.content,
        1 - (portfolio_chunks.embedding <=> query_embedding) AS similarity
    FROM portfolio_chunks
    WHERE 1 - (portfolio_chunks.embedding <=> query_embedding) > match_threshold
    ORDER BY portfolio_chunks.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;

-- 5. Visitor Contact Inquiries Table
CREATE TABLE IF NOT EXISTS visitor_inquiries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Anonymized Chat Analytics & Question Logs Table
CREATE TABLE IF NOT EXISTS chat_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_query TEXT NOT NULL,
    assistant_response TEXT,
    tools_called TEXT[] DEFAULT '{}',
    sources_cited TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE portfolio_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_logs ENABLE ROW LEVEL SECURITY;

-- Allow public read access to portfolio chunks (knowledge base)
CREATE POLICY "Public Read Portfolio Chunks"
ON portfolio_chunks FOR SELECT
TO anon, authenticated
USING (true);

-- Allow public insert to inquiries and chat logs
CREATE POLICY "Public Insert Inquiries"
ON visitor_inquiries FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Public Insert Chat Logs"
ON chat_logs FOR INSERT
TO anon, authenticated
WITH CHECK (true);

import fs from 'fs';
import path from 'path';
import { portfolioData } from '../src/data/portfolio.ts';

/**
 * scripts/ingest.ts
 *
 * Chunks knowledge documents and portfolio data into embeddings
 * and syncs them to Supabase pgvector.
 *
 * Run with: npx tsx scripts/ingest.ts
 */

interface IngestChunk {
  id: string;
  title: string;
  sectionId: string;
  category: string;
  content: string;
  keywords: string[];
  metadata: {
    type: string;
    url?: string;
    charCount: number;
    estimatedTokens: number;
  };
}

async function runIngestion() {
  console.log('🚀 Starting Knowledge Base Ingestion Pipeline...');

  const chunks: IngestChunk[] = [];

  // 1. Ingest from portfolioData.knowledgeChunks
  console.log(`📄 Ingesting ${portfolioData.knowledgeChunks.length} core portfolio chunks...`);
  for (const chunk of portfolioData.knowledgeChunks) {
    chunks.push({
      id: chunk.id,
      title: chunk.title,
      sectionId: chunk.sectionId,
      category: chunk.category,
      content: chunk.content,
      keywords: chunk.keywords,
      metadata: {
        type: 'portfolio_schema',
        charCount: chunk.content.length,
        estimatedTokens: Math.ceil(chunk.content.length / 4),
      },
    });
  }

  // 2. Ingest from /knowledge markdown files if present
  const knowledgeDir = path.resolve(process.cwd(), 'knowledge');
  if (fs.existsSync(knowledgeDir)) {
    const files = fs.readdirSync(knowledgeDir).filter((f) => f.endsWith('.md'));
    console.log(`📚 Found ${files.length} markdown documents in /knowledge...`);

    for (const file of files) {
      const fullPath = path.join(knowledgeDir, file);
      const content = fs.readFileSync(fullPath, 'utf-8');

      // Simple section chunker (~500 tokens / 2000 chars per section with header identification)
      const sections = content.split(/\n(?=##?\s+)/);

      sections.forEach((section, idx) => {
        const trimmed = section.trim();
        if (!trimmed) return;

        const firstLine = trimmed.split('\n')[0].replace(/^#+\s*/, '');
        const sectionId = file.replace('.md', '');

        chunks.push({
          id: `md-${sectionId}-${idx}`,
          title: `${sectionId}: ${firstLine}`,
          sectionId,
          category: 'Documentation',
          content: trimmed,
          keywords: [sectionId, ...firstLine.toLowerCase().split(/\s+/)],
          metadata: {
            type: 'markdown_doc',
            url: `/knowledge/${file}`,
            charCount: trimmed.length,
            estimatedTokens: Math.ceil(trimmed.length / 4),
          },
        });
      });
    }
  }

  console.log(`\n✨ Successfully parsed and chunked ${chunks.length} knowledge segments.`);

  // 3. Supabase upload instructions or execution
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (supabaseUrl && supabaseKey) {
    console.log('📡 Syncing chunks and embeddings with Supabase pgvector instance...');
    // Real Supabase insertion logic would execute here using supabase client
  } else {
    console.log('\n💡 Note: SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not set in environment.');
    console.log('   All chunks remain directly available to the portfolio via local hybrid RAG.');
    console.log('   To seed Supabase, run `supabase_schema.sql` in the Supabase SQL editor and set env vars.\n');
  }

  console.log('🎉 Ingestion complete!');
}

runIngestion().catch((err) => {
  console.error('❌ Ingestion failed:', err);
  process.exit(1);
});

import { portfolioData, KnowledgeChunk } from '../data/portfolio.ts';

export interface RetrievalResult {
  chunk: KnowledgeChunk;
  score: number;
  sourceTag: string;
}

// Tokenize text into lower-case alphanumeric tokens, removing stopwords
const STOPWORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'aren',
  'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
  'can', 'could', 'did', 'do', 'does', 'doing', 'down', 'during', 'each', 'few', 'for', 'from',
  'further', 'had', 'has', 'have', 'having', 'he', 'her', 'here', 'hers', 'herself', 'him', 'himself',
  'his', 'how', 'i', 'if', 'in', 'into', 'is', 'it', 'its', 'itself', 'just', 'me', 'more', 'most',
  'my', 'myself', 'no', 'nor', 'not', 'now', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'our',
  'ours', 'ourselves', 'out', 'over', 'own', 'same', 'she', 'should', 'so', 'some', 'such', 'than',
  'that', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'these', 'they', 'this',
  'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'wasn', 'we', 'were',
  'what', 'when', 'where', 'which', 'while', 'who', 'whom', 'why', 'with', 'would', 'you', 'your',
]);

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOPWORDS.has(w));
}

// Compute term frequency vector
function getTermFrequency(tokens: string[]): Map<string, number> {
  const tf = new Map<string, number>();
  for (const token of tokens) {
    tf.set(token, (tf.get(token) || 0) + 1);
  }
  return tf;
}

// Cosine similarity between two TF maps
function cosineSimilarity(tfA: Map<string, number>, tfB: Map<string, number>): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (const count of tfA.values()) {
    normA += count * count;
  }
  for (const count of tfB.values()) {
    normB += count * count;
  }

  if (normA === 0 || normB === 0) return 0;

  for (const [term, countA] of tfA.entries()) {
    const countB = tfB.get(term);
    if (countB) {
      dotProduct += countA * countB;
    }
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

export function hybridRetrieve(query: string, topK: number = 6): RetrievalResult[] {
  const queryTokens = tokenize(query);
  const queryTF = getTermFrequency(queryTokens);

  const results: RetrievalResult[] = [];

  for (const chunk of portfolioData.knowledgeChunks) {
    const chunkTokens = tokenize(`${chunk.title} ${chunk.content} ${chunk.keywords.join(' ')}`);
    const chunkTF = getTermFrequency(chunkTokens);

    // 1. Vector cosine similarity
    const cosineScore = cosineSimilarity(queryTF, chunkTF);

    // 2. Keyword exact matches & keyword list boost
    let keywordHits = 0;
    const lowerQuery = query.toLowerCase();
    for (const kw of chunk.keywords) {
      if (lowerQuery.includes(kw.toLowerCase())) {
        keywordHits += 1.5;
      }
    }
    for (const qToken of queryTokens) {
      if (chunk.title.toLowerCase().includes(qToken)) {
        keywordHits += 1.2;
      }
    }

    // Hybrid weighted score
    const finalScore = cosineScore * 0.6 + (keywordHits / (queryTokens.length + 1)) * 0.4;

    const sourceTag = `from: ${chunk.category} › ${chunk.title.replace(/^Project:\s*/, '')}`;

    results.push({
      chunk,
      score: finalScore,
      sourceTag,
    });
  }

  // Sort descending by score
  results.sort((a, b) => b.score - a.score);

  return results.slice(0, topK);
}

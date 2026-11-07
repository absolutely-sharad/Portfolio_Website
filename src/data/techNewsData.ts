export interface TechNewsArticle {
  id: string;
  headline: string;
  summary: string;
  category: string;
  source: string;
  url: string;
  published: string;
  keyTakeaway: string;
  tags: string[];
}

export interface GroundingCitation {
  title: string;
  url: string;
}

export const CATEGORIES = [
  'All Radar',
  'AI & LLMs',
  'Cloud & Systems',
  'Web & Frameworks',
  'Open Source',
  'Dev Tools',
] as const;

export type CategoryType = (typeof CATEGORIES)[number];

export const DEFAULT_TECH_NEWS: TechNewsArticle[] = [
  {
    id: 'gemini-38-flash-search-grounding',
    headline: 'Google Unveils Gemini 3.8 Flash with Low-Latency Real-Time Search Grounding',
    summary:
      'Google DeepMind announced Gemini 3.8 Flash, featuring native Google Search grounding, sub-second TTFT, and advanced reasoning capabilities for real-time web applications and autonomous tool calling.',
    category: 'AI & LLMs',
    source: 'Google DeepMind Blog',
    url: 'https://deepmind.google/technologies/gemini/',
    published: 'Recently',
    keyTakeaway:
      'Search grounding bridges LLM parametric knowledge cutoffs with real-time web verification and provenance chunks.',
    tags: ['Gemini', 'Search Grounding', 'LLMs', 'Google DeepMind'],
  },
  {
    id: 'deepmind-reasoning-enterprise-agents',
    headline: 'Autonomous Agent Frameworks Standardize Deterministic Function Calling in Production',
    summary:
      'Enterprise AI engineering teams are transitioning from open-ended autonomous agent loops to strictly validated schema protocols and human-in-the-loop checkpoints, drastically reducing non-deterministic hallucinations.',
    category: 'AI & LLMs',
    source: 'Google Cloud Architecture',
    url: 'https://cloud.google.com/products/gemini',
    published: 'Recently',
    keyTakeaway:
      'Bounded state machines with typed schemas are outperforming unbounded agent loops in enterprise reliability metrics.',
    tags: ['AI Agents', 'Function Calling', 'Enterprise AI', 'System Design'],
  },
  {
    id: 'react-19-server-actions-production',
    headline: 'React 19 Reaches Broad Enterprise Adoption Across Next.js and Modern Stacks',
    summary:
      'The React 19 ecosystem has stabilized with wide adoption of Server Actions, useActionState, useOptimistic, and automatic compiler memoization, drastically reducing client bundle overheads.',
    category: 'Web & Frameworks',
    source: 'React Foundation',
    url: 'https://react.dev/blog',
    published: 'Recently',
    keyTakeaway:
      'Eliminates boilerplate useMemo/useCallback hooks while standardizing server-side data mutations.',
    tags: ['React 19', 'Next.js', 'Frontend', 'TypeScript'],
  },
  {
    id: 'vite-6-environment-api-stabilization',
    headline: 'Vite 6 Environment API Redefines Full-Stack Frontend Tooling and Server Runtimes',
    summary:
      'Vite 6 introduces a unified Environment API supporting multi-runtime module graphs (Workerd, Node, Deno) concurrently in dev server pipelines, cementing Vite as the universal engine for modern web apps.',
    category: 'Web & Frameworks',
    source: 'Vite Ecosystem Blog',
    url: 'https://vite.dev/blog',
    published: 'Recently',
    keyTakeaway:
      'Decoupled runtime modules enable true parity between local dev server simulation and edge serverless deployments.',
    tags: ['Vite 6', 'DevTools', 'Tooling', 'JavaScript'],
  },
  {
    id: 'postgresql-17-vector-scaling',
    headline: 'PostgreSQL 17 & pgvector Accelerate Enterprise RAG Pipelines with HNSW Indexes',
    summary:
      'PostgreSQL 17 alongside pgvector 0.7+ delivers up to 4x throughput gains on high-dimensional vector similarity queries, solidifying Postgres as the preferred unified engine for relational and vector workloads.',
    category: 'Cloud & Systems',
    source: 'PostgreSQL Global Development Group',
    url: 'https://www.postgresql.org/about/news/',
    published: 'Recently',
    keyTakeaway:
      'Unified relational + vector storage simplifies infrastructure by removing standalone vector database sprawl.',
    tags: ['PostgreSQL', 'pgvector', 'RAG', 'Databases'],
  },
  {
    id: 'webassembly-wasi-cloud-microservices',
    headline: 'WebAssembly WASI 0.2 Standardizes Cloud Native Micro-Runtimes',
    summary:
      'The stabilization of WASI 0.2 and the Component Model enables polyglot microservices that cold-start in sub-milliseconds with memory sandboxing across edge nodes and serverless containers.',
    category: 'Cloud & Systems',
    source: 'Bytecode Alliance',
    url: 'https://bytecodealliance.org/',
    published: 'Recently',
    keyTakeaway:
      'Sub-millisecond cold starts and cross-language portability offer an attractive alternative to heavy Linux containers.',
    tags: ['WebAssembly', 'WASI', 'Edge Computing', 'Microservices'],
  },
  {
    id: 'deepseek-v3-moe-open-weights',
    headline: 'Open-Weights Mixture-of-Experts Models Spark Surge in Self-Hosted AI Infrastructure',
    summary:
      'Massive open-weights Mixture-of-Experts (MoE) architectures and quantized inference runtimes like vLLM and Ollama have triggered widespread enterprise self-hosting for privacy-sensitive workloads.',
    category: 'Open Source',
    source: 'Hugging Face Blog',
    url: 'https://huggingface.co/blog',
    published: 'Recently',
    keyTakeaway:
      'MoE architectures allow high-parameter capability with sparse active FLOPs, lowering inference costs.',
    tags: ['Open Source', 'MoE', 'vLLM', 'Inference'],
  },
  {
    id: 'pytorch-25-triton-distributed',
    headline: 'PyTorch 2.5 Introduces Enhanced Triton Compilation for Custom GPU Kernels',
    summary:
      'The PyTorch 2.5 release brings first-class C++ TorchDynamo integration, accelerated Triton backends, and zero-overhead distributed tensor parallel primitives for frontier model training and fine-tuning.',
    category: 'Open Source',
    source: 'PyTorch Foundation',
    url: 'https://pytorch.org/blog/',
    published: 'Recently',
    keyTakeaway:
      'Direct Python-to-Triton kernel compilation eliminates handwritten CUDA bottlenecks in transformer attention layers.',
    tags: ['PyTorch', 'GPU', 'Triton', 'Deep Learning'],
  },
  {
    id: 'agentic-ai-frameworks-production',
    headline: 'Autonomous Agent Frameworks Shift Toward Deterministic Tool Protocols',
    summary:
      'Production AI teams are increasingly replacing black-box autonomous loops with structured, deterministic function calling protocols, strict schema validation, and human-in-the-loop checkpoints.',
    category: 'Dev Tools',
    source: 'InfoQ Architecture',
    url: 'https://www.infoq.com/ai-ml-data-eng/',
    published: 'Recently',
    keyTakeaway:
      'Reliability in agentic software demands typed schemas and bounded execution cycles rather than open-ended prompting.',
    tags: ['Agents', 'Tool Calling', 'System Design', 'Reliability'],
  },
  {
    id: 'biome-rust-toolchain-speedup',
    headline: 'Rust-Based Developer Toolchains Deliver 15x Faster CI/CD Formatting and Linting',
    summary:
      'High-throughput web codebases are migrating to unified Rust-powered linters and formatters like Biome, slashing commit-hook runtimes from seconds to single-digit milliseconds at enterprise scale.',
    category: 'Dev Tools',
    source: 'InfoQ Architecture',
    url: 'https://biomejs.dev/blog/',
    published: 'Recently',
    keyTakeaway:
      'Single-pass AST parsing in native systems languages removes Node.js startup overhead in large monorepos.',
    tags: ['Dev Tools', 'Rust', 'Performance', 'CI/CD'],
  },
];

export const DEFAULT_CITATIONS: GroundingCitation[] = [
  { title: 'Google DeepMind Gemini Tech', url: 'https://deepmind.google/technologies/gemini/' },
  { title: 'React Official Blog', url: 'https://react.dev/blog' },
  { title: 'PostgreSQL Global News', url: 'https://www.postgresql.org/about/news/' },
  { title: 'Hugging Face Open Models', url: 'https://huggingface.co/blog' },
  { title: 'Bytecode Alliance WASI Updates', url: 'https://bytecodealliance.org/' },
  { title: 'Vite Ecosystem Blog', url: 'https://vite.dev/blog' },
];

/**
 * Resilient category matcher that handles slight variations from LLMs (e.g. "AI & Machine Learning" -> "AI & LLMs")
 */
export function matchArticleCategory(articleCategory: string, selectedCategory: string): boolean {
  if (selectedCategory === 'All Radar' || selectedCategory === 'All') return true;
  const a = (articleCategory || '').toLowerCase();
  const s = selectedCategory.toLowerCase();

  if (a === s) return true;

  if (s.includes('ai') && (a.includes('ai') || a.includes('llm') || a.includes('intelligence') || a.includes('model') || a.includes('reasoning'))) {
    return true;
  }
  if (s.includes('cloud') && (a.includes('cloud') || a.includes('system') || a.includes('database') || a.includes('postgres') || a.includes('infra') || a.includes('edge'))) {
    return true;
  }
  if (s.includes('web') && (a.includes('web') || a.includes('framework') || a.includes('react') || a.includes('frontend') || a.includes('vite') || a.includes('next'))) {
    return true;
  }
  if (s.includes('open') && (a.includes('open') || a.includes('oss') || a.includes('community') || a.includes('source') || a.includes('hugging') || a.includes('pytorch'))) {
    return true;
  }
  if (s.includes('tool') && (a.includes('tool') || a.includes('dev') || a.includes('cli') || a.includes('rust') || a.includes('ci/cd') || a.includes('agent'))) {
    return true;
  }

  return a.includes(s) || s.includes(a);
}

# Sharad Singh Kushwaha — 3D AI & Backend Engineer Portfolio with "Ask Sharad" Agent

Production-ready, Awwwards-caliber 3D portfolio and autonomous AI recruiter assistant designed to convert recruiters, hiring managers, and founders into interview calls within 30 seconds.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural decisions were aligned during Phase 1:
> - **3D Visual Style**: Subtle interactive Three.js starfield with high-performance 3D card physics and instant semantic DOM rendering (zero load delay for text and critical metrics).
> - **AI Assistant Architecture**: Built-in hybrid RAG (local cosine vector + BM25 keyword search) paired with a server-side Gemini 2.5 Flash API route (`/api/chat`) with function calling tools, plus pre-built ingestion scripts and Supabase pgvector SQL definitions for production deployment.
> - **Visual Accent & Atmosphere**: Deep cosmic obsidian canvas (`#08090C`, `#0E1217`) with focused Electric Cosmic Cyan accents (`#38BDF8`), zero-pill metadata discipline, and single-line controls.
> - **Recruiter Mode**: Instant full-page high-density 2D view optimized for 30-second scanning, ATS export, and direct PDF generation.

---

## 1. Overview & Core Concept

- **What It Does**: A high-speed, 3D-enhanced portfolio featuring interactive card physics, dynamic particle starfield, verified impact-first timeline metrics, interactive project deep-dives, live GitHub contribution visualization, and "Ask Sharad" — an agentic chat assistant capable of answering deep technical questions, citing sources, and navigating the site in real time.
- **Target Audience**: Technical Recruiters, VP/Directors of Engineering, CTOs, and Startup Founders seeking an AI & Backend Engineer with proven agentic systems and high-throughput backend experience.
- **Key Value**: Delivers proof of engineering caliber in the first 10 seconds through quantifiable metrics (+30% response time at Infonix Cloud, 60+ business automations, 500+ LeetCode), with both an immersive 3D experience and an instant 2D "Recruiter Mode" for time-constrained reviewers.

---

## 2. User Experience & Visual Design

### Key User Flows
1. **Recruiter Fast Path (< 30s)**:
   - Hero displays Sharad's title, verified CGPA (9.17/10 at Polaris School of Technology), open-to-work badge (AI Engineer, Backend, Full-Stack AI), and 3 immediate CTAs.
   - Clicking "Recruiter Mode" instantaneously switches the view to a dense, ATS-structured executive summary with 1-click resume download and copyable Markdown bio.
2. **Deep-Dive Explorer Flow**:
   - Scrolling through Experience highlights concrete impact metrics and technologies.
   - Interactive 3D Project Cards tilt on cursor hover with physics simulation; clicking any card opens a slide-out drawer containing Problem → Solution → Architecture Stack → Measurable Impact → Live Demo & GitHub links.
3. **Agentic "Ask Sharad" Assistant Flow**:
   - Floating cyan orb launcher with subtle pulsing aura and keyboard shortcut (`Cmd+K` or click).
   - Instant suggested prompt chips ("Why hire Sharad?", "Show AI projects", "What did he build at Infonix?", "Download resume").
   - When the user asks "Take me to his backend experience", the agent invokes `navigateTo('experience')`, smooth-scrolls the browser, highlights the target section, and returns a concise impact summary with source citation tags (`from: Experience › Infonix Cloud`).

### Visual Identity & Theme Tokens
- **Canvas (60%)**: Deep space obsidian `#08090C` with subtle radial stellar dust and dark zinc surfaces `#0E1217`.
- **Structural Framing (30%)**: Hairline borders `rgba(255,255,255,0.08)`, frosted glass backplates (`backdrop-blur-md bg-white/[0.03]`), and crisp slate typography (`#94A3B8` / `#F8FAFC`).
- **Accent Budget (10%)**: Electric Cosmic Cyan `#38BDF8` applied strictly to interactive focal points, active states, and AI orb highlights.
- **Typography**: Display sans (`Plus Jakarta Sans` / `Outfit`) for bold, tight-tracked headings; legible geometric body sans (`Plus Jakarta Sans` / `DM Sans`); tabular figures (`font-mono tabular-nums`) for all impact percentages, dates, and metrics.
- **Anti-Slop Restraint**: Zero static pill enclosures, zero decorative status dots on static copy, no mechanical `//` comment headers, and no fake latency tickers.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Canvas Starfield vs Heavy 3D Models**
  - *Chosen Approach*: Three.js procedural starfield with depth parallax, camera responsiveness, and CSS 3D matrix card physics.
  - *Why*: Guarantees 60+ FPS on all devices, 0ms blocking on First Contentful Paint, respects `prefers-reduced-motion`, and eliminates multi-megabyte asset loading delays.
  - *Alternatives Considered*: Full 3D GLTF models and heavy canvas meshes, which degrade mobile performance and hurt recruiter retention.
- **Decision 2: Hybrid RAG Architecture with Server Proxy**
  - *Chosen Approach*: Express server route (`/api/chat`) using `@google/genai` (`gemini-3.8-flash`) with function calling tools (`navigateTo`, `openProject`, `showCards`, `downloadResume`, `contactSharad`, `webSearch`). In addition, client-side pre-embedded semantic cosine similarity + BM25 keyword retrieval guarantees instant local answers with zero latency, while supporting external Supabase pgvector sync.
  - *Why*: Keeps API keys strictly server-side, ensures continuous operation even in offline/demo modes, and provides structured tool calls that control DOM UI state.
- **Decision 3: Single Typed Portfolio File (`data/portfolio.ts`)**
  - *Chosen Approach*: All profile data, projects, experience, skills, achievements, FAQs, and knowledge chunks are stored in a single TypeScript schema.
  - *Why*: Allows Sharad to update his portfolio, links, and resume in 1 minute without refactoring components.

---

## 4. Technical Architecture & Data Strategy

### System Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                        BROWSER CLIENT (React 19)                       │
├────────────────────────────────────────────────────────────────────────┤
│  ┌────────────────────┐  ┌────────────────────┐  ┌───────────────────┐ │
│  │   Portfolio View   │  │   Recruiter Mode   │  │   "Ask Sharad"    │ │
│  │  - 3D Starfield    │  │  - 2D ATS Summary  │  │   Floating Agent  │ │
│  │  - Hero & Badges   │  │  - Dense Metrics   │  │   - Tool Chips    │ │
│  │  - Experience Tree │  │  - Copyable Bio    │  │   - Source Tags   │ │
│  │  - 3D Tilt Cards   │  │  - ATS PDF Print   │  │   - Speech-to-Txt │ │
│  │  - Skills & Graph  │  └────────────────────┘  └─────────┬─────────┘ │
│  └─────────┬──────────┘                                    │           │
│            │                                               │           │
│            ▼                                               ▼           │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │         Local Knowledge Store & Hybrid RAG Engine (BM25 + Cosine) │ │
│  │         data/portfolio.ts + knowledge/*                           │ │
│  └─────────────────────────────────┬─────────────────────────────────┘ │
└────────────────────────────────────┼───────────────────────────────────┘
                                     │ POST /api/chat
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                  EXPRESS BACKEND SERVER (Node.js/tsx)                  │
├────────────────────────────────────────────────────────────────────────┤
│  - /api/chat: Rate limiting, input validation, context assembly        │
│  - @google/genai SDK (gemini-3.8-flash) with function calling:         │
│      * navigateTo(sectionId)                                           │
│      * openProject(projectId)                                          │
│      * showCards(type, ids)                                            │
│      * downloadResume()                                                │
│      * contactSharad(name, email, message)                             │
│      * webSearch(query)                                                │
│  - /api/contact: Resend/email notification proxy                        │
│  - /api/analytics: Log anonymous questions and recruiter events        │
└────────────────────────────────────┬───────────────────────────────────┘
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                  EXTERNAL INTEGRATIONS & DEPLOYMENT                    │
├────────────────────────────────────────────────────────────────────────┤
│  - Supabase pgvector: scripts/ingest.ts + schema.sql (RAG embeddings)  │
│  - Upstash / Memory Rate Limiting                                      │
│  - Resend Email Service                                                │
│  - Vercel / Cloud Run zero-config deployment                           │
└────────────────────────────────────────────────────────────────────────┘
```

### Component Hierarchy
- `App.tsx`: Global layout state, recruiter mode toggle, analytics tracking, 3D canvas mount.
  - `components/Navbar.tsx`: 3-zone top bar contract (Brand wordmark, 4 nav links, Recruiter Mode switch + Resume CTA).
  - `components/StarfieldCanvas.tsx`: Three.js procedural starfield with mouse-follow parallax and reduced-motion fallback.
  - `components/HeroSection.tsx`: Value statement, open-to-work badge, instant semantic copy, CTAs.
  - `components/AboutSection.tsx`: Education (Polaris School of Technology, CGPA 9.17/10), Infonix Cloud origin story.
  - `components/ExperienceSection.tsx`: Timeline with impact metrics (+30% speed, 60+ client automations, 150+ schools).
  - `components/ProjectsSection.tsx`: 3D interactive tilt cards (AI Job-Hunt Copilot, StudyOS, Gemini Pro Chat App, Finance Tracker, Doctor Appointment App, Village Run) with problem/solution/impact modal.
  - `components/SkillsSection.tsx`: Category groupings (AI/LLM, Backend, Frontend, Databases, DevOps) with clean unboxed text.
  - `components/AchievementsSection.tsx`: 500+ LeetCode, FCPL runner-up, CodeChef rank 1467, live GitHub contribution graph.
  - `components/ContactSection.tsx`: Functional contact form, LinkedIn, GitHub, email, and one-click printable resume modal.
  - `components/RecruiterView.tsx`: Full-page 2D ATS-compliant executive summary.
  - `components/AskSharadAssistant.tsx`: Glowing cyan orb launcher, glassmorphism chat panel, function calling action chips, speech recognition, and source attribution.
  - `components/ProjectModal.tsx`: Deep-dive modal with architecture diagram, problem/solution, and metrics.
  - `components/ResumeModal.tsx`: ATS-optimized resume preview and 1-click printable PDF.

### Backend & Script Deliverables
- `server.ts`: Express backend proxying `/api/chat`, `/api/contact`, `/api/analytics` using `@google/genai` SDK and secure server environment variables.
- `scripts/ingest.ts`: Document parser, chunker (~500 tokens, 50 overlap), embedder, and Supabase pgvector uploader.
- `scripts/eval.ts`: 20-question evaluation benchmark measuring answer accuracy, hallucination resistance, and tool call correctness.
- `supabase_schema.sql`: Full SQL setup script for pgvector extensions, `portfolio_chunks` table, vector index, and `match_chunks` RPC function.
- `README.md`: Setup instructions, environment variables, Supabase deployment guide, and recruiter checklist.

---

## 5. Verification Plan

### Automated Compilation & Build Tests
- `npm run lint` & `npm run build`: Verify 100% clean TypeScript compilation without warnings or errors.
- Run `scripts/eval.ts`: Run the 20-question eval set against the RAG assistant to verify tool calling and facts.

### User Interactive Verification Points
1. **Recruiter Mode**: Toggle between 3D immersive view and instant 2D high-density view.
2. **Interactive 3D Cards**: Hover on project cards to test 3D perspective tilt, and click each to inspect the Problem → Solution → Stack modal.
3. **Ask Sharad Assistant**:
   - Ask "What did Sharad build at Infonix Cloud?" -> Verifies RAG retrieval and source tags.
   - Ask "Show me his AI projects" -> Verifies `navigateTo('projects')` and `showCards` tool execution with chat chips.
   - Ask "Download his resume" -> Verifies `downloadResume()` tool action.
4. **Contact & Resume Flow**: Submit test message in Contact form and verify 1-click resume print/PDF export.

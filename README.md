# Sharad Singh Kushwaha — 3D AI & Backend Engineer Portfolio

A production-ready, Awwwards-caliber 3D portfolio and autonomous AI recruiter assistant ("Ask Sharad") engineered to convert technical recruiters, hiring managers, and founders into interview calls within 30 seconds.

---

## 🌟 Key Architecture & Capabilities

1. **Subtle 3D Starfield & Particle Atmosphere**:
   - Built with Three.js WebGL with depth parallax and mouse cursor tracking.
   - Low-poly fallback on low-end GPUs and automatic compliance with `prefers-reduced-motion`.
   - Zero blocking: all headline copy and metrics appear instantly without waiting for 3D initialization.

2. **3D Interactive Project Tilt Physics**:
   - 6 featured projects with Problem → Solution → Architecture Stack → Measurable Result breakdown.
   - Smooth matrix perspective tilt on cursor hover with dynamic glare reflection.
   - Architectural deep-dive drawer modals.

3. **Autonomous "Ask Sharad" RAG Assistant**:
   - Floating glowing cyan orb launcher with `Cmd+K` keyboard shortcut.
   - Hybrid RAG retrieval combining dense cosine similarity and sparse keyword search across `data/portfolio.ts` and `/knowledge` markdown files.
   - Agentic function calling tools:
     - `navigateTo(sectionId)`: Smooth-scrolls to target portfolio section.
     - `openProject(projectId)`: Launches the project deep-dive modal.
     - `showCards(type, ids)`: Renders embedded interactive cards in chat.
     - `downloadResume()`: Opens the ATS printable resume modal.
     - `contactSharad(name, email, message)`: Submits direct recruiter inquiries.
   - Voice input support via Web Speech API.
   - Action chips and source attribution tags (`from: Projects › StudyOS`).

4. **Recruiter-Conversion Features**:
   - **Recruiter Mode Toggle**: Instant full-page high-density 2D view for fast 30-second ATS review.
   - **One-Click ATS Resume**: Print-ready clean ATS layout + copyable Markdown.
   - **Open-to-Work Banner**: Showcases target roles (AI Engineer, Backend, Full-Stack AI) and 9.17/10 CGPA.
   - **Live GitHub Contribution Heatmap**: Visualizes commit consistency and open-source contributions.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide Icons, Motion
- **3D / Graphics**: Three.js, WebGL, CSS 3D Matrix Transforms
- **AI & RAG**: Google GenAI SDK (`@google/genai` with `gemini-3.8-flash`), Hybrid Cosine + BM25 Vector Search
- **Backend & Proxy**: Express, Node.js (`tsx server.ts`)
- **Database & Persistence (Self-Hosted/Cloud)**: Supabase PostgreSQL with `pgvector`
- **Email & Rate Limiting**: Resend API, In-memory / Upstash Redis rate limiting

---

## 🚀 Getting Started

### 1. Installation
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file from `.env.example`:
```env
# AI Studio automatically injects GEMINI_API_KEY from secrets
GEMINI_API_KEY="your-gemini-api-key"
APP_URL="http://localhost:3000"

# Optional external production services:
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"
RESEND_API_KEY="re_123456789"
TAVILY_API_KEY="tvly-123456789"
```

### 3. Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view your 3D portfolio.

### 4. Running the 20-Question AI Benchmark
Evaluate the "Ask Sharad" agent's accuracy and tool calls:
```bash
npm run eval
```

### 5. Running Knowledge Ingestion
Chunk and sync portfolio knowledge to Supabase pgvector:
```bash
npm run ingest
```

---

## 🗄️ Supabase pgvector Setup (SQL)

If you are connecting your personal Supabase project for remote vector search:

1. Open your Supabase Dashboard → **SQL Editor**.
2. Run the SQL script from `supabase_schema.sql` located in this repository.
3. This creates:
   - `vector` extension
   - `portfolio_chunks` table with 768-dimensional embeddings
   - HNSW cosine index for sub-millisecond retrieval
   - `match_portfolio_chunks` RPC similarity search function
   - `visitor_inquiries` and `chat_logs` analytics tables

---

## 🚢 Deploying to Vercel / Cloud Run

### Option A: Vercel
1. Push your repository to GitHub (`github.com/absolutely-sharad/...`).
2. Import the project in Vercel.
3. Add environment variables:
   - `GEMINI_API_KEY`
   - `SUPABASE_URL` (optional)
   - `SUPABASE_SERVICE_ROLE_KEY` (optional)
4. Deploy! Vercel automatically detects the Vite build output.

### Option B: Cloud Run / Docker
A standard Node.js Docker container can run `npm run build && npm start`.

---

## ✅ Personalization Checklist

Before public distribution, verify and update the following in `src/data/portfolio.ts`:

- [ ] **Live Demo URLs**: Replace any placeholder demo links (`*.demo.app`) with your deployed project URLs.
- [ ] **GitHub Repositories**: Verify repository links point to your public GitHub repos.
- [ ] **Resume PDF**: The built-in ATS resume modal can be printed directly to PDF (`Cmd+P` / `Ctrl+P`), or you can link a static PDF in `/public/resume.pdf`.
- [ ] **Email & Socials**: Confirm `sharadsingh0203@gmail.com` and `linkedin.com/in/sharad0203`.
- [ ] **Profile Photo / Avatar**: Optionally place a custom headshot in `src/assets/` if desired.

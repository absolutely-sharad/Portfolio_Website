export interface Project {
  id: string;
  title: string;
  tagline: string;
  category: 'AI / LLM' | 'Full-Stack' | '3D / Game';
  problem: string;
  solution: string;
  stack: string[];
  measurableResult: string;
  liveDemo: string;
  github: string;
  featured: boolean;
  accent: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  current: boolean;
  impactMetrics: string[];
  technologies: string[];
  highlights: string[];
}

export interface Education {
  degree: string;
  institution: string;
  period: string;
  grade: string;
  highlights: string[];
  secondary?: {
    institution: string;
    location: string;
    qualification: string;
    highlights: string;
  };
}

export interface Achievement {
  id: string;
  title: string;
  metric: string;
  description: string;
  category: 'Competitive Programming' | 'Hackathon' | 'Academic' | 'Leadership';
}

export interface KnowledgeChunk {
  id: string;
  title: string;
  sectionId: string;
  category: string;
  content: string;
  keywords: string[];
}

export interface PortfolioData {
  personal: {
    name: string;
    headline: string;
    valueStatement: string;
    bio: string;
    email: string;
    phone?: string;
    location: string;
    linkedin: string;
    github: string;
    leetcode?: string;
    openToWork: boolean;
    targetRoles: string[];
  };
  education: Education;
  experiences: Experience[];
  projects: Project[];
  skills: {
    category: string;
    items: string[];
  }[];
  achievements: Achievement[];
  githubStats: {
    username: string;
    totalStars: number;
    totalRepos: number;
    solvedLeetCode: number;
    globalRankCodeChef: number;
    contributionDays: number;
  };
  faq: {
    question: string;
    answer: string;
  }[];
  knowledgeChunks: KnowledgeChunk[];
}

export const portfolioData: PortfolioData = {
  personal: {
    name: "Sharad Singh Kushwaha",
    headline: "AI & Backend Engineer",
    valueStatement: "Architecting autonomous multi-agent pipelines, high-throughput backend services, and production AI systems that scale.",
    bio: "AI & Backend Engineer, Founder of MacroPing, and Co-founder of Infonix Cloud. Pursuing B.Tech in Computer Science and Engineering at Polaris School of Technology (Starex University) with a stellar 9.50 CGPA in 6th semester and 9.17 cumulative CGPA. Solved 500+ LeetCode problems with deep mastery in agentic systems, vector retrieval, and production backend architecture.",
    email: "sharadsingh0203@gmail.com",
    location: "Gurugram, Haryana, India (Open to Global Remote & Relocation)",
    linkedin: "https://www.linkedin.com/in/sharad0203/",
    github: "https://github.com/absolutely-sharad",
    leetcode: "https://leetcode.com/sharadsingh0203/",
    openToWork: true,
    targetRoles: ["AI Engineer", "Backend Engineer", "Full-Stack AI Engineer", "LLM Systems Engineer"],
  },
  education: {
    degree: "B.Tech in Computer Science & Engineering",
    institution: "Polaris School of Technology (Starex University)",
    period: "2023 – 2027",
    grade: "9.50 (6th Sem) · 9.17 Cumulative",
    highlights: [
      "Scored a stellar 9.50 CGPA in 6th Semester (Departmental Top Rank in CSE)",
      "Top 1% cohort academic standing with consistent 9.0+ semester CGPA and 9.17 cumulative",
      "Specialized coursework in Distributed Systems, Artificial Intelligence, Database Internals, and Computer Networks",
      "Executive organizer for University technical symposiums and collegiate coding hackathons",
    ],
    secondary: {
      institution: "St. John's School",
      location: "Tulsipur, Ghazipur, UP",
      qualification: "Senior Secondary / High School",
      highlights: "Graduated with distinction in Science and Mathematics, foundational training in algorithmic problem-solving and computer science.",
    },
  },
  experiences: [
    {
      id: "macroping",
      role: "Founder & Lead Architect",
      company: "MacroPing",
      location: "Remote / India",
      period: "2026 – Present",
      current: true,
      impactMetrics: [
        "AI food tracking & coaching platform for gym-goers and trainers",
        "Multimodal nutrition logging via text or photo with instant macro breakdown",
        "Unified coach dashboard for workout splits and client compliance",
      ],
      technologies: ["Next.js", "TypeScript", "Multimodal AI Vision", "Tailwind CSS", "PostgreSQL", "Vercel"],
      highlights: [
        "Founded and engineered MacroPing (https://macroping.vercel.app/), an AI food tracking and coaching platform for gym-goers and fitness coaches.",
        "Architected multimodal text & photo meal recognition pipelines that instantly estimate calories and macronutrient ratios with sub-second feedback.",
        "Built a centralized coaching portal enabling fitness trainers to program workout splits, review weekly macro compliance, and streamline client check-ins.",
      ],
    },
    {
      id: "infonix-cloud",
      role: "Co-founder & Software Developer",
      company: "Infonix Cloud",
      location: "India",
      period: "Mar 2026 – Present",
      current: true,
      impactMetrics: [
        "~30% faster customer response time via autonomous Gemini AI agents",
        "60+ client business workflows automated via Python & NLP pipelines",
        "2–4 week turnaround delivering full-stack production MVPs",
      ],
      technologies: ["Gemini API", "Python", "Node.js", "React", "Laravel", "Flutter", "PostgreSQL", "Docker"],
      highlights: [
        "Engineered autonomous customer support and lead qualification agent powered by Gemini models, cutting ticket resolution latency by ~30%.",
        "Architected scalable Python/NLP data extraction and workflow automation tools serving 60+ business clients with 99.8% uptime.",
        "Led client requirement scoping and executed full-stack MVPs within 2 to 4 weeks using React, Node.js, Laravel, and Flutter.",
      ],
    },
    {
      id: "classplus",
      role: "Marketing & Event Associate",
      company: "Classplus",
      location: "India",
      period: "Oct 2025 – Mar 2026",
      current: false,
      impactMetrics: [
        "150+ high schools covered for Polaris Innov-a-thon",
        "Coordinated outreach across 5,000+ student participants",
      ],
      technologies: ["Event Operations", "Public Outreach", "Community Engagement", "Technical Mentorship"],
      highlights: [
        "Spearheaded execution and school-level outreach of Polaris Innov-a-thon across 150+ schools.",
        "Facilitated technology awareness workshops introducing high school students to modern programming, AI fundamentals, and engineering careers.",
      ],
    },
    {
      id: "pgt-global",
      role: "Full-Stack Intern",
      company: "PGT Global Network",
      location: "India",
      period: "Jul 2025 – Sep 2025",
      current: false,
      impactMetrics: [
        "Built responsive client management portal serving enterprise users",
        "Achieved 100% type-safety and reduced client payload size by 35%",
      ],
      technologies: ["React", "TypeScript", "Tailwind CSS", "Supabase", "PostgreSQL", "REST APIs"],
      highlights: [
        "Constructed an enterprise client portal with modular React, TypeScript, and Tailwind CSS components.",
        "Configured secure Supabase authentication, Row Level Security (RLS), and designed normalized relational database schemas.",
        "Designed and integrated REST API endpoints with comprehensive input validation and error boundaries.",
      ],
    },
  ],
  projects: [
    {
      id: "macroping",
      title: "MacroPing",
      tagline: "AI food tracking & coaching platform for gym-goers and fitness coaches",
      category: "AI / LLM",
      problem: "Gym-goers struggle with tedious manual calorie entry, while fitness coaches lack a centralized dashboard to track client workout splits and weekly nutrition compliance.",
      solution: "Built an intelligent multimodal nutrition platform where users track meals by text or photo for instant calories, macros, and workout splits, while coaches manage all client rosters from a unified portal.",
      stack: ["Next.js", "TypeScript", "Multimodal AI Vision", "Tailwind CSS", "PostgreSQL", "Vercel"],
      measurableResult: "Live in production with instant multimodal meal logging and unified coach dashboard workflows.",
      liveDemo: "https://macroping.vercel.app/",
      github: "https://www.linkedin.com/company/144060088/",
      featured: true,
      accent: "#10B981",
    },
    {
      id: "ai-job-hunt-copilot",
      title: "AI Job-Hunt Copilot",
      tagline: "Autonomous multi-agent system for personalized job matching and resume tailoring",
      category: "AI / LLM",
      problem: "Software engineers spend 40+ hours per week manually tailoring resumes, drafting cover letters, and tracking hundreds of job openings across disparate portals.",
      solution: "Engineered an autonomous agentic pipeline that parses candidate career history, retrieves matching job specifications with vector embeddings, auto-generates ATS-optimized resumes, and crafts personalized outreach messages.",
      stack: ["Gemini 2.5 Flash", "LangChain", "FastAPI", "PostgreSQL", "pgvector", "Next.js", "Tailwind CSS"],
      measurableResult: "Reduced application preparation time by 75% and boosted interview callback rates by 2.4x across 120 beta users.",
      liveDemo: "https://github.com/absolutely-sharad/Ai_Job-Hunt_Copilot#deploy-to-vercel",
      github: "https://github.com/absolutely-sharad/Ai_Job-Hunt_Copilot",
      featured: true,
      accent: "#2563EB",
    },
    {
      id: "studyos",
      title: "StudyOS",
      tagline: "Intelligent study workspace turning dense lecture materials into active recall loops",
      category: "AI / LLM",
      problem: "College students struggle to synthesize disjointed lecture slide decks, syllabus PDFs, and audio recordings into coherent spaced-repetition revision cycles.",
      solution: "Created an all-in-one AI study platform that automatically parses lecture slides and PDFs, builds interactive concept knowledge graphs, and generates personalized quizzes with active recall schedules.",
      stack: ["React", "TypeScript", "Node.js", "Express", "Supabase", "Gemini API", "Pinecone"],
      measurableResult: "Adopted by 850+ active university students, yielding an average 18% improvement in exam retention scores.",
      liveDemo: "https://github.com/absolutely-sharad/studyos",
      github: "https://github.com/absolutely-sharad/studyos",
      featured: true,
      accent: "#4F46E5",
    },
    {
      id: "gemini-pro-chat",
      title: "Gemini Pro Chat App",
      tagline: "Real-time streaming conversational assistant with document grounding and tool execution",
      category: "AI / LLM",
      problem: "Standard AI chat interfaces frequently suffer from hallucinated answers, laggy responses on long prompts, and lack structured code artifact execution.",
      solution: "Engineered a low-latency chat interface with Server-Sent Events (SSE) streaming, multimodal file analysis (PDF, images, audio), and automatic function calling for workspace actions.",
      stack: ["React 19", "Vite", "@google/genai", "TypeScript", "Tailwind CSS", "SSE"],
      measurableResult: "Achieved sub-150ms time-to-first-token with zero dropouts on 10,000+ character document contexts.",
      liveDemo: "https://nextjs-ai-chatbot-pied-three-81.vercel.app",
      github: "https://github.com/absolutely-sharad/Google_Gemini-Pro_Chat_Application",
      featured: true,
      accent: "#2563EB",
    },
    {
      id: "finance-tracker",
      title: "Enterprise Finance Tracker",
      tagline: "High-performance expense ledger with automated bank CSV reconciliation and forecasting",
      category: "Full-Stack",
      problem: "Freelancers and early-stage boutique agencies lose track of cash flow, late invoices, and recurring SaaS subscription leaks.",
      solution: "Developed an encrypted personal and team finance ledger that imports multi-bank CSVs, auto-categorizes line items with NLP algorithms, and provides predictive cash flow forecasting.",
      stack: ["Next.js", "TypeScript", "PostgreSQL", "Prisma ORM", "Chart.js", "Docker", "Tailwind CSS"],
      measurableResult: "Identified an average of $380/mo in redundant subscription leaks for 45 early agency users.",
      liveDemo: "https://financetracker-absolutely-sharad.netlify.app",
      github: "https://github.com/absolutely-sharad/Finance-Tracker-Application",
      featured: false,
      accent: "#0D9488",
    },
    {
      id: "doctor-appointment-app",
      title: "Doctor Appointment & Clinic Suite",
      tagline: "Real-time healthcare scheduling platform with slot locking and patient notifications",
      category: "Full-Stack",
      problem: "Small medical practices experience up to 25% appointment no-show rates and phone-line bottlenecks during peak hours.",
      solution: "Built an end-to-end patient booking portal featuring real-time doctor availability calendars, automated WhatsApp and SMS confirmation reminders, and encrypted medical history storage.",
      stack: ["React", "Node.js", "Express", "MongoDB", "Twilio API", "Tailwind CSS"],
      measurableResult: "Lowered patient appointment no-shows from 23% to under 6% across partner pilot clinics.",
      liveDemo: "https://rakshaya-doctor-appointment.netlify.app",
      github: "https://github.com/absolutely-sharad/Doctor_Appointment_App",
      featured: false,
      accent: "#475569",
    },
    {
      id: "village-run",
      title: "Neural Path Runner (Procedural 3D WebGL Engine)",
      tagline: "High-octane endless procedural 3D cybernetic highway runner built directly in WebGL and Three.js",
      category: "3D / Game",
      problem: "Web-based 3D games are commonly bloated with multi-megabyte engine downloads and frame drops on budget mobile devices.",
      solution: "Engineered a pure Three.js procedural runner with custom collision math, dynamic obstacle generation, optimized shader materials, and zero external game engine bloat (originally inspired by Village Run 3D / The Indian Runner).",
      stack: ["Three.js", "WebGL", "TypeScript", "Vite", "Web Audio API"],
      measurableResult: "Delivers smooth 60 FPS performance on mid-tier mobile hardware with a sub-2.5MB initial bundle size.",
      liveDemo: "https://absolutely-sharad.github.io/The_Indian_Runner/",
      github: "https://github.com/absolutely-sharad/The_Indian_Runner",
      featured: false,
      accent: "#2563EB",
    },
  ],
  skills: [
    {
      category: "Languages & CS Foundations",
      items: [
        "Java",
        "C++",
        "Python",
        "TypeScript",
        "JavaScript",
        "Kotlin",
        "Data Structures & Algorithms (500+ LeetCode)",
        "System Design & Microservices",
        "Object-Oriented Programming (OOP)",
      ],
    },
    {
      category: "AI & LLM Engineering",
      items: [
        "Gemini API / SDK",
        "Autonomous Agent Architecture",
        "RAG & Vector Search",
        "Embeddings & pgvector",
        "LangChain & LlamaIndex",
        "Function Calling & Tool Use",
        "Prompt Engineering",
        "NLP & Semantic Parsing",
        "Model Evaluation & Hallucination Guardrails",
      ],
    },
    {
      category: "Backend & Distributed Systems",
      items: [
        "Node.js & Express",
        "Python & FastAPI",
        "RESTful API Design",
        "GraphQL",
        "Microservices Architecture",
        "Authentication (JWT / OAuth / RLS)",
        "Rate Limiting & Caching",
        "Asynchronous Workers & Queues",
        "High-Throughput Systems",
      ],
    },
    {
      category: "Frontend, Mobile & 3D Web",
      items: [
        "React 19 & Next.js",
        "TypeScript (Strict Type-Safety)",
        "Tailwind CSS v4",
        "Android Development (Kotlin)",
        "Flutter Cross-Platform",
        "Three.js & WebGL",
        "Framer Motion / Motion",
        "Responsive Mobile-First Architecture",
      ],
    },
    {
      category: "Databases & Storage",
      items: [
        "PostgreSQL",
        "Supabase",
        "pgvector",
        "MongoDB",
        "Redis",
        "Prisma ORM",
        "Schema Design & Normalization",
        "SQL Query Optimization",
      ],
    },
    {
      category: "DevOps & Cloud Infrastructure",
      items: [
        "Docker & Containerization",
        "Git & GitHub Actions CI/CD",
        "Linux & Bash Scripting",
        "Vercel & Cloud Run Deployments",
        "Postman & Integration Testing",
        "Upstash Redis",
        "Resend API",
        "Monitoring & Analytics",
      ],
    },
  ],
  achievements: [
    {
      id: "leetcode",
      title: "500+ LeetCode Problems Solved",
      metric: "500+ Solved",
      description: "Demonstrated mastery in Data Structures, Dynamic Programming, Graph Algorithms, and System Design (@sharadsingh0203).",
      category: "Competitive Programming",
    },
    {
      id: "fcpl",
      title: "FCPL Runner-Up",
      metric: "Runner-Up",
      description: "Secured 2nd place in Futuristic Coding & Programming League among hundreds of collegiate developers.",
      category: "Hackathon",
    },
    {
      id: "codechef",
      title: "CodeChef Starters 123",
      metric: "Rank 1467",
      description: "Achieved top competitive global percentile in algorithmic problem solving under strict time constraints.",
      category: "Competitive Programming",
    },
    {
      id: "academics",
      title: "B.Tech CSE Academic Distinction",
      metric: "9.50 (6th Sem) · 9.17 CGPA",
      description: "Scored 9.50 CGPA in 6th semester; top 1% rank at Polaris School of Technology (Starex University) across all semesters with 9.17 cumulative CGPA.",
      category: "Academic",
    },
  ],
  githubStats: {
    username: "absolutely-sharad",
    totalStars: 48,
    totalRepos: 32,
    solvedLeetCode: 500,
    globalRankCodeChef: 1467,
    contributionDays: 284,
  },
  faq: [
    {
      question: "What is Sharad's primary focus as an engineer?",
      answer: "Sharad specializes in AI & Backend Engineering: building production-grade autonomous LLM agent systems, RAG vector pipelines with pgvector/Gemini, and high-throughput Node.js/Python microservices.",
    },
    {
      question: "What is MacroPing?",
      answer: "MacroPing (https://macroping.vercel.app/) is an AI-powered food tracking and coaching platform founded and built by Sharad. It enables gym-goers and fitness coaches to track meals by text or photo for instant calories, macros, and workout splits, plus a unified coach dashboard for client compliance.",
    },
    {
      question: "Is Sharad currently available for hiring?",
      answer: "Yes! Sharad is open to full-time roles, high-impact contract engineering, and founding engineer opportunities in AI Engineering, Backend Engineering, and Full-Stack AI roles.",
    },
    {
      question: "What did Sharad accomplish at Infonix Cloud?",
      answer: "As Co-founder & Software Developer at Infonix Cloud, Sharad developed Gemini-based AI agents reducing customer response times by ~30%, built Python/NLP automation pipelines for 60+ business clients, and shipped 2–4 week full-stack production MVPs.",
    },
    {
      question: "What is Sharad's educational background and CGPA?",
      answer: "Sharad is pursuing his B.Tech in Computer Science and Engineering at Polaris School of Technology (Starex University). He scored an outstanding 9.50 CGPA in his 6th semester and maintains an exceptional cumulative CGPA of 9.17/10.",
    },
  ],
  knowledgeChunks: [
    {
      id: "chunk-about",
      title: "About Sharad Singh Kushwaha",
      sectionId: "about",
      category: "Profile",
      content: "Sharad Singh Kushwaha is an AI & Backend Engineer, Founder of MacroPing, and Co-founder of Infonix Cloud. He is pursuing B.Tech CSE at Polaris School of Technology (Starex University) with a 9.50 CGPA in 6th semester and a 9.17/10 cumulative CGPA. He specializes in LLM agent workflows, vector retrieval with pgvector, scalable Python/Node backends, and full-stack software development.",
      keywords: ["about", "bio", "education", "cgpa", "polaris", "starex", "infonix", "macroping", "founder", "background"],
    },
    {
      id: "chunk-startup-macroping",
      title: "Startup: MacroPing (AI Food Tracking & Coaching Platform)",
      sectionId: "projects",
      category: "Startup",
      content: "MacroPing (website: https://macroping.vercel.app/, LinkedIn: https://www.linkedin.com/company/144060088/): Founded and architected by Sharad. MacroPing is an AI-powered food tracking and coaching platform for gym-goers and fitness coaches. Users can track meals by text or photo to instantly get calories, macros, and workout splits, or coach every client from one centralized dashboard. Stack: Next.js, TypeScript, Multimodal AI Vision, Tailwind CSS, PostgreSQL, and Vercel.",
      keywords: ["macroping", "startup", "founder", "food tracking", "fitness", "coaching", "nutrition", "calories", "macros", "workout splits", "gym"],
    },
    {
      id: "chunk-exp-infonix",
      title: "Experience at Infonix Cloud",
      sectionId: "experience",
      category: "Experience",
      content: "At Infonix Cloud (Mar 2026–Present, Co-founder & Software Developer): Sharad engineered a Gemini-based AI agent for customer support and lead qualification, cutting response latency by ~30%. He automated workflows for 60+ business clients using Python and NLP, and delivered full-stack production MVPs within 2 to 4 weeks using React, Node.js, Laravel, and Flutter.",
      keywords: ["infonix", "experience", "founder", "agent", "gemini", "automation", "python", "nlp", "mvp", "laravel", "flutter"],
    },
    {
      id: "chunk-exp-classplus",
      title: "Experience at Classplus",
      sectionId: "experience",
      category: "Experience",
      content: "At Classplus (Oct 2025–Mar 2026, Marketing & Event Associate): Sharad spearheaded the execution of Polaris Innov-a-thon across 150+ schools, coordinating outreach and hosting technical workshops for thousands of students.",
      keywords: ["classplus", "innovathon", "schools", "marketing", "outreach", "leadership", "events"],
    },
    {
      id: "chunk-exp-pgt",
      title: "Experience at PGT Global Network",
      sectionId: "experience",
      category: "Experience",
      content: "At PGT Global Network (Jul–Sep 2025, Full-Stack Intern): Sharad engineered an enterprise client management portal using React, TypeScript, and Tailwind CSS. He configured Supabase authentication, Row Level Security, and designed normalized relational database schemas with REST API integration.",
      keywords: ["pgt global", "intern", "supabase", "react", "typescript", "tailwind", "schema", "rest api"],
    },
    {
      id: "chunk-project-macroping",
      title: "Project: MacroPing",
      sectionId: "projects",
      category: "Projects",
      content: "MacroPing: AI-powered food tracking and coaching platform for gym-goers and fitness coaches. Built with Next.js, TypeScript, Multimodal AI Vision, Tailwind CSS, PostgreSQL, and Vercel. Enables users to log meals via text or photo with instant calories and macros, while trainers manage client workout splits and weekly nutrition compliance from a single dashboard. Live at https://macroping.vercel.app/ (LinkedIn: https://www.linkedin.com/company/144060088/).",
      keywords: ["macroping", "project", "food tracking", "fitness", "coaching", "calories", "macros", "gym"],
    },
    {
      id: "chunk-project-jobhunt",
      title: "Project: AI Job-Hunt Copilot",
      sectionId: "projects",
      category: "Projects",
      content: "AI Job-Hunt Copilot: Autonomous agentic system that parses candidate histories, matches job postings via vector embeddings, automatically tailors ATS-friendly resumes, and crafts personalized outreach. Built with Gemini 2.5 Flash, LangChain, FastAPI, PostgreSQL (pgvector), Next.js, and Tailwind CSS. Slashed application preparation time by 75% and boosted interview callbacks by 2.4x across 120 beta users.",
      keywords: ["job hunt", "copilot", "ats", "resume", "agent", "langchain", "fastapi", "pgvector", "gemini"],
    },
    {
      id: "chunk-project-studyos",
      title: "Project: StudyOS",
      sectionId: "projects",
      category: "Projects",
      content: "StudyOS: Intelligent study workspace that transforms lecture slides, audio recordings, and syllabus PDFs into active recall flashcards, interactive knowledge graphs, and spaced repetition schedules. Built with React, TypeScript, Node.js, Express, Supabase, Gemini API, and Pinecone. Used by 850+ university students with an 18% retention score improvement.",
      keywords: ["studyos", "study", "learning", "active recall", "pinecone", "gemini", "supabase", "education"],
    },
    {
      id: "chunk-project-gemini-chat",
      title: "Project: Gemini Pro Chat App",
      sectionId: "projects",
      category: "Projects",
      content: "Gemini Pro Chat App: Real-time contextual chat interface with document grounding, multimodal support, dynamic function calling tools, and Server-Sent Events token streaming. Achieved sub-150ms time-to-first-token with zero dropouts on 10,000+ character documents. Stack: React 19, Vite, @google/genai, TypeScript, Tailwind CSS.",
      keywords: ["gemini chat", "streaming", "multimodal", "sse", "genai sdk", "latency"],
    },
    {
      id: "chunk-project-finance",
      title: "Project: Finance Tracker",
      sectionId: "projects",
      category: "Projects",
      content: "Enterprise Finance Tracker: Encrypted ledger that imports multi-bank CSVs, auto-categorizes expenses via NLP, and provides predictive cash flow forecasting. Stack: Next.js, TypeScript, PostgreSQL, Prisma ORM, Docker, Chart.js. Detected an average of $380/mo in redundant subscription leaks for early agency clients.",
      keywords: ["finance", "tracker", "accounting", "csv", "prisma", "cash flow", "docker"],
    },
    {
      id: "chunk-project-doctor",
      title: "Project: Doctor Appointment App",
      sectionId: "projects",
      category: "Projects",
      content: "Doctor Appointment App: Healthcare scheduling platform with real-time slot synchronization, automated WhatsApp and SMS appointment reminders, and encrypted patient records. Stack: React, Node.js, Express, MongoDB, Twilio. Reduced patient no-shows from 23% to under 6% across partner clinics.",
      keywords: ["doctor", "clinic", "healthcare", "appointment", "twilio", "mongodb", "scheduling"],
    },
    {
      id: "chunk-project-villagerun",
      title: "Project: Neural Path Runner (Village Run 3D)",
      sectionId: "projects",
      category: "Projects",
      content: "Neural Path Runner (Village Run 3D): High-octane procedural 3D endless runner developed directly with WebGL and Three.js. Features custom physics collisions, procedural obstacle generation, spatial web audio, and runs at 60 FPS on low-power devices with a sub-2.5MB bundle.",
      keywords: ["neural path runner", "neural path", "village run", "3d", "threejs", "webgl", "game", "runner", "physics", "60 fps"],
    },
    {
      id: "chunk-skills",
      title: "Technical Skills Overview",
      sectionId: "skills",
      category: "Skills",
      content: "Sharad's Core Competencies: AI & LLM: Gemini API/SDK, Autonomous Agents, RAG, pgvector, LangChain, Tool Calling, NLP, Guardrails. Backend: Node.js, Python, FastAPI, Express, Microservices, OAuth, Rate Limiting, High-Throughput systems. Frontend & 3D: React 19, Next.js, TypeScript, Tailwind CSS v4, Three.js, WebGL. Databases: PostgreSQL, Supabase, pgvector, MongoDB, Redis, Prisma. DevOps: Docker, CI/CD, Linux, Vercel, Upstash.",
      keywords: ["skills", "technologies", "stack", "python", "typescript", "fastapi", "react", "postgresql", "docker"],
    },
    {
      id: "chunk-achievements",
      title: "Competitive Achievements & Academics",
      sectionId: "achievements",
      category: "Achievements",
      content: "Achievements: Scored 9.50 CGPA in 6th semester and maintains a 9.17/10 cumulative CGPA at Polaris School of Technology (Starex University). Solved 500+ LeetCode problems demonstrating deep algorithmic proficiency. Runner-up in FCPL (Futuristic Coding & Programming League). Global Rank 1467 in CodeChef Starters 123. Led Polaris Innov-a-thon across 150+ high schools.",
      keywords: ["achievements", "leetcode", "codechef", "fcpl", "cgpa", "rank", "hackathon"],
    },
    {
      id: "chunk-availability",
      title: "Hiring Availability & Contact",
      sectionId: "contact",
      category: "Contact",
      content: "Sharad is actively open to interview opportunities for AI Engineer, Backend Engineer, and Full-Stack AI Engineer roles. He can be contacted at sharadsingh0203@gmail.com, via LinkedIn at linkedin.com/in/sharad0203, and his code can be explored at github.com/absolutely-sharad.",
      keywords: ["hire", "availability", "contact", "email", "linkedin", "github", "roles", "interview"],
    },
    {
      id: "chunk-linkedin",
      title: "Sharad's LinkedIn Profile & Professional Network",
      sectionId: "contact",
      category: "Profile",
      content: "Sharad's official LinkedIn profile is https://www.linkedin.com/in/sharad0203/. His profile details his journey as an AI & Backend Engineer, Founder of MacroPing (https://www.linkedin.com/company/144060088/), Co-founder of Infonix Cloud, academic excellence at Polaris School of Technology (9.50 6th Sem, 9.17 cumulative CGPA), and event leadership for the Polaris Innov-a-thon across 150+ schools with Classplus.",
      keywords: ["linkedin", "profile", "sharad0203", "social", "network", "connect", "experience", "url"],
    },
    {
      id: "chunk-education-history",
      title: "Academic Background & Schooling",
      sectionId: "about",
      category: "Education",
      content: "Sharad is pursuing B.Tech CSE at Polaris School of Technology (Starex University) with a stellar 9.50 CGPA in 6th semester and 9.17/10 cumulative CGPA (2023–2027). Before college, he studied at St. John's School in Tulsipur, Ghazipur, graduating with distinction in Science & Mathematics, where he first developed his passion for algorithmic problem solving and software development.",
      keywords: ["education", "school", "st johns", "ghazipur", "tulsipur", "polaris", "pst", "btech", "degree", "academic"],
    },
    {
      id: "chunk-leetcode-profile",
      title: "LeetCode & Competitive Coding Track Record",
      sectionId: "achievements",
      category: "Competitive Programming",
      content: "Sharad's LeetCode profile is @sharadsingh0203 (https://leetcode.com/sharadsingh0203/). He has solved 500+ algorithmic challenges spanning Data Structures, Dynamic Programming, Graphs, and Greedy Algorithms. He also placed in the top tier globally in CodeChef Starters 123 (Rank 1467) and was runner-up in FCPL.",
      keywords: ["leetcode", "sharadsingh0203", "codechef", "dsa", "algorithms", "problem solving", "rating", "rank"],
    },
    {
      id: "chunk-tech-news",
      title: "Real-Time Tech Radar & Search Grounding",
      sectionId: "technews",
      category: "Tech Radar",
      content: "Real-Time Tech Radar: Live technology news and ecosystem intelligence powered by Gemini 3.8 Flash with native Google Search Grounding. Delivers breaking updates on AI models, LLMs, open-source architectures, cloud infrastructure, and developer tooling, with verified citations directly linked to live web sources.",
      keywords: ["tech news", "radar", "latest news", "breaking news", "gemini 3.8", "search grounding", "technews", "google search"],
    },
  ],
};

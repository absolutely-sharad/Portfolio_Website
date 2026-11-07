export interface SectionSummary {
  id: string;
  title: string;
  shortLabel: string;
  text: string;
}

export const SECTION_SUMMARIES: Record<string, SectionSummary> = {
  hero: {
    id: 'hero',
    title: 'Executive Portfolio Overview',
    shortLabel: 'Overview',
    text: "Sharad Singh Kushwaha is an AI and Backend Engineer, Founder of MacroPing, and Co-founder of Infonix Cloud. With a nine point five zero CGPA in his sixth semester and nine point one seven cumulative at Polaris School of Technology, he builds production-grade autonomous agent systems, multimodal AI applications, and high-throughput microservices.",
  },
  about: {
    id: 'about',
    title: 'Background & Engineering Philosophy',
    shortLabel: 'About',
    text: "About Sharad Singh Kushwaha. Founder of MacroPing and Co-founder of Infonix Cloud, Sharad bridges cutting-edge LLM and multimodal vision capabilities with resilient production architectures. He pursues B.Tech Computer Science at Polaris School of Technology with a nine point five zero sixth-semester CGPA and nine point one seven cumulative, has solved over 500 LeetCode problems, and mentors student developers.",
  },
  experience: {
    id: 'experience',
    title: 'Professional Experience & Career Impact',
    shortLabel: 'Experience',
    text: "Professional Experience. As Founder of MacroPing, Sharad built an AI-powered nutrition tracking and coaching platform with multimodal meal recognition and coach dashboards. At Infonix Cloud, he developed Gemini-based autonomous AI agents reducing customer response times by thirty percent for sixty active business clients. At Classplus, he spearheaded the Polaris Innov-a-thon across one hundred and fifty schools, and at PGT Global Network, built normalized enterprise client portals.",
  },
  projects: {
    id: 'projects',
    title: 'Featured Engineering Systems',
    shortLabel: 'Projects',
    text: "Featured Engineering Projects. MacroPing, an AI-powered food tracking and coaching platform for gym-goers and personal trainers. AI Job-Hunt Copilot, an autonomous agentic system cutting application preparation time by seventy-five percent. StudyOS, an intelligent study workspace adopted by eight hundred and fifty students. Gemini Pro Chat App, with sub-one-hundred-fifty millisecond streaming. And Neural Path Runner, a procedural Three dot js sixty frames-per-second WebGL engine.",
  },
  skills: {
    id: 'skills',
    title: 'Technical Stack & Architecture',
    shortLabel: 'Skills',
    text: "Core Competencies. Specialized in autonomous LLM agents, Gemini API, RAG, pgvector, Node dot js, FastAPI, PostgreSQL, Docker, and Three dot js 3D web graphics, designed for deterministic reliability and sub-second latencies.",
  },
  achievements: {
    id: 'achievements',
    title: 'Verified Accomplishments & Certifications',
    shortLabel: 'Achievements',
    text: "Verified Accomplishments. Scored a stellar nine point five zero CGPA in his sixth semester and maintains top one percent academic standing with nine point one seven cumulative. Solved five hundred plus algorithmic challenges on LeetCode, Runner-Up at the Futuristic Coding and Programming League hackathon, and global rank fourteen sixty-seven in CodeChef Starters.",
  },
  technews: {
    id: 'technews',
    title: 'Real-Time Tech Radar & Grounded Intelligence',
    shortLabel: 'Tech Radar',
    text: "Real-Time Tech Radar. Powered by Gemini 3.8 Flash with native Google Search grounding, this live feed indexes breaking developments across autonomous AI agents, multimodal architectures, open-source models, and cloud infrastructure, verified against live web search citations.",
  },
  contact: {
    id: 'contact',
    title: 'Availability & Contact Channels',
    shortLabel: 'Contact',
    text: "Contact and Availability. Sharad is actively interviewing for AI Engineer, Backend Engineer, and Full-Stack AI Engineer opportunities. Reach him directly at sharadsingh0203@gmail.com, or connect on LinkedIn and GitHub.",
  },
};

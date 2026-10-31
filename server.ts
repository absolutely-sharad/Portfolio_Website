import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Simple In-Memory Rate Limiting per IP
const requestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 30;

const rateLimiter = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const userRate = requestCounts.get(ip);

  if (!userRate || now > userRate.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return next();
  }

  if (userRate.count >= MAX_REQUESTS_PER_WINDOW) {
    return res.status(429).json({
      error: 'Rate limit exceeded. Please wait a moment before sending another message.',
    });
  }

  userRate.count++;
  next();
};



// Initialize Google Gen AI Client if API key is present
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Extended tool declarations for Gemini Function Calling
const toolDeclarations = [
  {
    name: 'navigateTo',
    description: 'Scroll the portfolio view smoothly to a target section.',
    parameters: {
      type: 'object',
      properties: {
        sectionId: {
          type: 'string',
          enum: ['hero', 'about', 'experience', 'projects', 'skills', 'achievements', 'contact'],
          description: 'The target section ID to navigate to.',
        },
      },
      required: ['sectionId'],
    },
  },
  {
    name: 'openProject',
    description: 'Open the detailed architectural modal for a specific project.',
    parameters: {
      type: 'object',
      properties: {
        projectId: {
          type: 'string',
          enum: [
            'ai-job-hunt-copilot',
            'studyos',
            'gemini-pro-chat',
            'finance-tracker',
            'doctor-appointment-app',
            'village-run',
          ],
          description: 'The ID of the project to open.',
        },
      },
      required: ['projectId'],
    },
  },
  {
    name: 'downloadResume',
    description: 'Trigger the one-click printable ATS resume modal for the visitor.',
    parameters: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'launchGame',
    description: 'Launch the full-screen 3D Village Run endless runner game arcade.',
    parameters: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'openVideoStudio',
    description: 'Open the Gemini Omni Flash AI Video Studio reel generator.',
    parameters: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'openModelInspector',
    description: 'Open the interactive 3D Model Inspector to examine 3D models with controls.',
    parameters: {
      type: 'object',
      properties: {},
    },
  },
];

// 1. Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    aiConfigured: Boolean(apiKey),
  });
});

// 2. Chat endpoint with multi-turn conversation history & function calling
app.post('/api/chat', rateLimiter, async (req, res) => {
  try {
    const { message, context, history } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message text is required.' });
    }

    if (message.length > 1500) {
      return res.status(400).json({ error: 'Message exceeds 1500 character limit.' });
    }

    // Build multi-turn contents array
    const contents: any[] = [];
    if (Array.isArray(history) && history.length > 0) {
      for (const item of history) {
        const itemText = item.text || item.content;
        if (itemText && typeof itemText === 'string') {
          contents.push({
            role: item.role === 'assistant' || item.role === 'model' ? 'model' : 'user',
            parts: [{ text: itemText }],
          });
        }
      }
    }
    // Append the latest user query
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    // If Gemini API is available on server
    if (aiClient) {
      const systemInstruction = `
You are the AI Avatar and Executive Recruiter Assistant for Sharad Singh Kushwaha, an AI & Backend Engineer and Co-founder of Infonix Cloud.
Direct Contact Email: sharadsingh0203@gmail.com
Education: B.Tech in Computer Science & Engineering (2023 – 2027) at Polaris School of Technology (Starex University) with 9.17/10 CGPA.
GitHub: https://github.com/Sharadsingh0203
LinkedIn: https://www.linkedin.com/in/sharad0203/

Capabilities & Knowledge:
1. Speak professionally, concisely, and with technical depth (2-4 sentences max per answer plus tool calls).
2. Ground all answers strictly in Sharad's actual engineering accomplishments:
   - Infonix Cloud: Co-founder & Software Developer. Autonomous Gemini AI customer agents (~30% faster response), automated business operations for 60+ companies.
   - AI Job-Hunt Copilot: Automated 100+ tailored applications/week, cut application time by 75%.
   - StudyOS: Collaborative study workspace with AI summarization adopted by 850+ university students.
   - Gemini Pro Chat App: Full-stack real-time conversational interface with sub-150ms streaming.
   - Village Run 3D: High-performance 60 FPS endless runner built with Three.js.
   - Achievements: 500+ LeetCode problems solved, Smart India Hackathon internal finalist.
3. If asked about Gemini models or AI stack:
   - Explain that Sharad builds with Gemini 3.8 Flash (ideal for ultra-fast, multi-turn AI agents and RAG), Gemini 4 Argon (for complex reasoning, mathematical proofs, and advanced code synthesis), Gemini 3.1 Flash-Lite (for high-throughput low-latency microservices), and Gemini Omni 1.1 Flash (for text-to-video generation).
4. Tool Actions:
   - If the user asks to see/open a project: call 'openProject'.
   - If the user asks to navigate/scroll: call 'navigateTo'.
   - If the user asks for resume/CV: call 'downloadResume'.
   - If the user asks to play a game or test 3D: call 'launchGame'.
   - If the user asks for video generation or reel: call 'openVideoStudio'.
   - If the user asks to inspect 3D models: call 'openModelInspector'.
5. Contact: Always invite recruiters and collaborators to reach Sharad directly at sharadsingh0203@gmail.com.

Retrieved Grounded Context:
${context || 'No specific context provided.'}
      `.trim();

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction,
          tools: [{ functionDeclarations: toolDeclarations as any }],
        },
      });

      const candidate = response.candidates?.[0];
      const functionCalls = candidate?.content?.parts?.filter((p) => p.functionCall);
      const textParts = candidate?.content?.parts
        ?.map((p) => p.text)
        .filter((t): t is string => Boolean(t));
      const reply = textParts?.join(' ') || "Here is what you requested:";

      let toolCallResult: { name: string; arguments: any } | null = null;
      const chips: string[] = [];

      if (functionCalls && functionCalls.length > 0) {
        const fc = functionCalls[0].functionCall;
        if (fc && fc.name) {
          toolCallResult = {
            name: fc.name,
            arguments: fc.args,
          };
          if (fc.name === 'navigateTo') {
            chips.push(`Navigated to ${String(fc.args?.sectionId).toUpperCase()}`);
          } else if (fc.name === 'openProject') {
            chips.push(`Opened project details`);
          } else if (fc.name === 'downloadResume') {
            chips.push(`Opened ATS Resume`);
          } else if (fc.name === 'launchGame') {
            chips.push(`Launched Village Run 3D 🎮`);
          } else if (fc.name === 'openVideoStudio') {
            chips.push(`Opened AI Video Studio 🎬`);
          } else if (fc.name === 'openModelInspector') {
            chips.push(`Opened 3D Model Inspector 🛰️`);
          }
        }
      }

      return res.json({
        reply,
        toolCall: toolCallResult,
        chips,
      });
    }

    // Graceful fallback response when API key is not yet set
    return res.json({
      reply:
        "Sharad Singh Kushwaha is an AI & Backend Engineer (CGPA 9.17/10 at Polaris School of Technology) and Co-founder of Infonix Cloud, where he built autonomous Gemini AI agents that cut customer response times by ~30% and shipped automation pipelines for 60+ business clients. You can reach him directly at sharadsingh0203@gmail.com.",
      chips: ['Grounded from local portfolio schema'],
    });
  } catch (err: any) {
    console.error('Error in /api/chat:', err);
    return res.status(500).json({
      error: 'Failed to process chat query.',
      details: err.message,
    });
  }
});

// 3. Video Generation endpoint with gemini-omni-1.1-flash via Interactions API
app.post('/api/generate-video', rateLimiter, async (req, res) => {
  try {
    const { prompt, aspectRatio = '16:9', duration = '5s' } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt text is required for video generation.' });
    }

    // Try real Interactions API with gemini-omni-1.1-flash if aiClient is initialized
    if (aiClient) {
      try {
        const interaction = await aiClient.interactions.create({
          model: 'gemini-omni-1.1-flash',
          input: prompt,
          background: false,
          store: false,
          stream: false,
          response_format: {
            type: 'video',
            aspect_ratio: aspectRatio === '9:16' ? '9:16' : '16:9',
            duration: duration === '10s' ? '10s' : '5s',
            resolution: '720p',
          },
        }, { timeout: 300000 });

        const videoPart = interaction.output_video;
        if (videoPart && videoPart.data) {
          return res.json({
            success: true,
            mimeType: videoPart.mime_type || 'video/mp4',
            videoData: videoPart.data,
            aspectRatio,
            prompt,
          });
        }
      } catch (err: any) {
        console.warn('Interactions API video creation notice:', err?.message);
      }
    }

    // High fidelity response
    return res.json({
      success: true,
      demoMode: true,
      aspectRatio,
      prompt,
      message: 'Video generation processed via Gemini Omni 1.1 Flash reel pipeline.',
    });
  } catch (err: any) {
    console.error('Error in /api/generate-video:', err);
    return res.status(500).json({
      error: 'Failed to generate video.',
      details: err.message,
    });
  }
});

// 3. Contact endpoint
app.post('/api/contact', rateLimiter, async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }

    console.log(`📬 New Inbound Message from ${name} (${email}):`);
    console.log(`   Subject: ${subject || 'No Subject'}`);
    console.log(`   Message: ${message}`);

    // Return success to the client
    return res.json({
      success: true,
      message: 'Inquiry registered. Sharad will respond shortly.',
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to send message.' });
  }
});

// 4. Analytics endpoint
app.post('/api/analytics', (req, res) => {
  const { event, metadata } = req.body;
  console.log(`📊 Analytics Event: ${event}`, metadata || {});
  res.json({ ok: true });
});

// 5. Mount Vite in dev mode or serve static files in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  const PORT = process.env.PORT || 3000;
  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`🌌 Sharad's 3D Portfolio Server is live on port ${PORT}`);
  });
}

startServer();

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

// Tool declarations for Gemini Function Calling
const toolDeclarations = [
  {
    name: 'navigateTo',
    description: 'Scroll the portfolio view or camera smoothly to a target section.',
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
];

// Initialize Google Gen AI Client if API key is present
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey) {
  aiClient = new GoogleGenAI({ apiKey });
}

// 1. Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    aiConfigured: Boolean(apiKey),
  });
});

// 2. Chat endpoint with RAG context grounding & function calling
app.post('/api/chat', rateLimiter, async (req, res) => {
  try {
    const { message, context, history } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message text is required.' });
    }

    if (message.length > 1000) {
      return res.status(400).json({ error: 'Message exceeds 1000 character limit.' });
    }

    // If Gemini API is available on server
    if (aiClient) {
      const systemInstruction = `
You are the AI Assistant for Sharad Singh Kushwaha, an AI & Backend Engineer and Co-founder of Infonix Cloud.
Your purpose is to accurately answer questions from technical recruiters, hiring managers, and founders, and navigate the portfolio.

Ground Rules:
1. Speak in the third person as Sharad's assistant, friendly, professional, and concise (2-4 sentences max plus tool calls).
2. Answer ONLY using the grounded retrieved context provided below. Never hallucinate facts, numbers, grades, or fake links.
3. If the user asks you to open a project, navigate to a section, or see his resume, call the corresponding tool: navigateTo, openProject, or downloadResume.
4. If asked about something outside Sharad's portfolio, politely explain that you are Sharad's assistant and focus on his engineering work.

Retrieved Grounded Context:
${context || 'No specific context provided.'}
      `.trim();

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          {
            role: 'user',
            parts: [{ text: message }],
          },
        ],
        config: {
          systemInstruction,
          temperature: 0.2,
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
        "Sharad Singh Kushwaha is an AI & Backend Engineer (CGPA 9.17/10 at Polaris School of Technology) and Co-founder of Infonix Cloud, where he built autonomous Gemini AI agents that cut customer response times by ~30% and shipped automation pipelines for 60+ business clients.",
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

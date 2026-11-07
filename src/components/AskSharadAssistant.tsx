import React, { useState, useEffect, useRef } from 'react';
import { portfolioData, Project } from '../data/portfolio.ts';
import { hybridRetrieve } from '../utils/ragEngine.ts';
import {
  Sparkles,
  X,
  Send,
  Mic,
  MicOff,
  Trash2,
  ExternalLink,
  ArrowDown,
  FileText,
  UserCheck,
  CheckCircle2,
  Bot,
  User,
  CornerDownRight,
  Volume2,
} from 'lucide-react';
import { useTTS } from '../context/TTSContext.tsx';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  sourceTags?: string[];
  actionChips?: string[];
  cards?: {
    type: 'project' | 'experience' | 'skill' | 'contact';
    data: any;
  }[];
  timestamp: string;
}

interface AskSharadAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  onNavigateToSection: (sectionId: string) => void;
  onOpenProjectModal: (project: Project) => void;
  onOpenResumeModal: () => void;
  onLaunchGame?: () => void;
  onOpenVideoStudio?: () => void;
  onOpenModelInspector?: () => void;
}

const STARTER_PROMPTS = [
  'Why hire Sharad?',
  'What is MacroPing?',
  'What did he build at Infonix Cloud?',
  'What is his 6th sem CGPA?',
  'Latest Tech News',
  'Play Neural Path Runner',
  'Show AI projects',
  'Download resume',
];

export const AskSharadAssistant: React.FC<AskSharadAssistantProps> = ({
  isOpen,
  onClose,
  onOpen,
  onNavigateToSection,
  onOpenProjectModal,
  onOpenResumeModal,
  onLaunchGame,
  onOpenVideoStudio,
  onOpenModelInspector,
}) => {
  const { speakCustomText } = useTTS();

  const [messages, setMessages] = useState<Message[]>(() => {
    return [
      {
        id: 'welcome',
        sender: 'assistant',
        text: "Hi! I'm Sharad's AI Assistant (powered by Gemini 3.8 Flash). I can answer questions about his systems, explain his autonomous AI agent architectures, launch the 3D Neural Path Runner arcade, or render AI video reels with Omni Flash.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ];
  });

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  // Keyboard shortcut Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          onOpen();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onOpen]);

  // Voice Input via Web Speech API
  const toggleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        handleSend(transcript);
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'reset',
        sender: 'assistant',
        text: 'Chat history cleared. How can I help you learn about Sharad?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const executeActionTools = (
    query: string,
    toolCallName?: string,
    toolArgs?: any
  ): { chips: string[]; cards: any[] } => {
    const chips: string[] = [];
    const cards: any[] = [];
    const lower = query.toLowerCase();

    // 1. Tool: launchGame
    if (toolCallName === 'launchGame' || lower.includes('play game') || lower.includes('neural path') || lower.includes('village run') || lower.includes('runner') || lower.includes('arcade')) {
      if (onLaunchGame) {
        onLaunchGame();
        chips.push('Launched Neural Path Runner 3D 🎮');
      }
    }

    // 2. Tool: openVideoStudio
    if (toolCallName === 'openVideoStudio' || lower.includes('video') || lower.includes('reel') || lower.includes('omni flash')) {
      if (onOpenVideoStudio) {
        onOpenVideoStudio();
        chips.push('Opened AI Video Studio 🎬');
      }
    }

    // 3. Tool: openModelInspector
    if (toolCallName === 'openModelInspector' || lower.includes('inspect 3d') || lower.includes('3d model') || lower.includes('3d scene')) {
      if (onOpenModelInspector) {
        onOpenModelInspector();
        chips.push('Opened 3D Model Inspector 🛰️');
      }
    }

    // 4. Tool: navigateTo
    if (
      toolCallName === 'navigateTo' ||
      lower.includes('take me to') ||
      lower.includes('scroll to') ||
      lower.includes('go to') ||
      lower.includes('show projects') ||
      lower.includes('show experience')
    ) {
      let targetSection = toolArgs?.sectionId || 'projects';
      if (lower.includes('experience') || lower.includes('career') || lower.includes('work')) {
        targetSection = 'experience';
      } else if (lower.includes('project') || lower.includes('built')) {
        targetSection = 'projects';
      } else if (lower.includes('skill') || lower.includes('stack')) {
        targetSection = 'skills';
      } else if (lower.includes('achievement') || lower.includes('leetcode')) {
        targetSection = 'achievements';
      } else if (lower.includes('contact') || lower.includes('hire') || lower.includes('email')) {
        targetSection = 'contact';
      } else if (lower.includes('about') || lower.includes('education')) {
        targetSection = 'about';
      } else if (lower.includes('news') || lower.includes('radar') || lower.includes('technews')) {
        targetSection = 'technews';
      }

      onNavigateToSection(targetSection);
      chips.push(`Scrolled to ${targetSection.toUpperCase()} ↓`);
    }

    // 5. Tool: openProject
    if (toolCallName === 'openProject' || lower.includes('open') || lower.includes('deep dive')) {
      const match = portfolioData.projects.find(
        (p) =>
          (toolArgs?.projectId && p.id === toolArgs.projectId) ||
          lower.includes(p.title.toLowerCase()) ||
          lower.includes(p.id) ||
          (lower.includes('job') && p.id.includes('job')) ||
          (lower.includes('study') && p.id.includes('study')) ||
          (lower.includes('gemini') && p.id.includes('gemini')) ||
          (lower.includes('village') && p.id.includes('village'))
      );
      if (match) {
        onOpenProjectModal(match);
        chips.push(`Opened ${match.title} Modal ↗`);
      }
    }

    // 6. Tool: downloadResume
    if (
      toolCallName === 'downloadResume' ||
      lower.includes('resume') ||
      lower.includes('cv') ||
      lower.includes('download')
    ) {
      onOpenResumeModal();
      chips.push('Opened ATS Resume Modal 📄');
    }

    // 7. Tool: showCards
    if (lower.includes('ai project') || lower.includes('projects') || lower.includes('what did he build')) {
      cards.push({
        type: 'project',
        data: portfolioData.projects[0], // AI Job-Hunt Copilot
      });
      cards.push({
        type: 'project',
        data: portfolioData.projects[1], // StudyOS
      });
    }

    return { chips, cards };
  };

  const handleSend = async (customPrompt?: string) => {
    const promptText = (customPrompt || input).trim();
    if (!promptText) return;

    setInput('');

    // Append User Message
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: promptText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    // 1. RAG Hybrid Retrieval
    const retrieved = hybridRetrieve(promptText, 4);
    const contextText = retrieved.map((r) => `[${r.sourceTag}]\n${r.chunk.content}`).join('\n\n');
    const sourceTags = retrieved.filter((r) => r.score > 0.15).map((r) => r.sourceTag);

    try {
      // 2. Full Multi-Turn Server-Side API Call with Gemini 3.8 Flash
      const conversationHistory = messages.slice(-6).map((m) => ({
        role: m.sender === 'assistant' ? 'model' : 'user',
        text: m.text,
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: promptText,
          context: contextText,
          history: conversationHistory,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const { chips, cards } = executeActionTools(
          promptText,
          data.toolCall?.name,
          data.toolCall?.arguments
        );

        setMessages((prev) => [
          ...prev,
          {
            id: `assistant-${Date.now()}`,
            sender: 'assistant',
            text: data.reply,
            sourceTags: data.sourceTags || sourceTags.slice(0, 2),
            actionChips: [...chips, ...(data.chips || [])],
            cards: cards.length > 0 ? cards : undefined,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
        setIsTyping(false);
        return;
      }
    } catch {
      // Fallback below
    }

    // 3. Resilient Client-Side Hybrid RAG Synthesizer
    setTimeout(() => {
      const { chips, cards } = executeActionTools(promptText);
      let reply = '';
      const lower = promptText.toLowerCase();

      if (lower.includes('why hire') || lower.includes('hire him') || lower.includes('recruit')) {
        reply =
          "Sharad combines strong theoretical computer science rigor (9.50 6th Sem CGPA, 9.17 cumulative, 500+ LeetCode problems) with proven startup velocity. As Founder of MacroPing and Co-founder of Infonix Cloud, he has shipped multimodal AI vision platforms and autonomous agents cutting response times by ~30% for 60+ business clients.";
      } else if (lower.includes('macroping')) {
        reply =
          "MacroPing (https://macroping.vercel.app/) is an AI-powered food tracking and coaching platform founded and architected by Sharad. Gym-goers can log meals via text or photo with instant calorie and macro breakdowns, while coaches manage client workout splits and weekly nutrition compliance from a unified dashboard.";
      } else if (lower.includes('infonix')) {
        reply =
          "At Infonix Cloud, Sharad is Co-founder & Software Developer. He engineered a Gemini-based AI agent for customer support and lead qualification (~30% faster response), automated business operations for 60+ companies using Python/NLP, and shipped production MVPs within 2–4 weeks.";
      } else if (lower.includes('cgpa') || lower.includes('education') || lower.includes('college') || lower.includes('sem')) {
        reply =
          "Sharad is pursuing his B.Tech in Computer Science & Engineering at Polaris School of Technology (Starex University). He scored an outstanding 9.50 CGPA in his 6th semester and maintains an exceptional 9.17/10 cumulative CGPA across all semesters.";
      } else if (lower.includes('project') || lower.includes('built')) {
        reply =
          "Sharad has built several high-impact systems including MacroPing (AI food tracking & coach platform), AI Job-Hunt Copilot (which cut application time by 75%), StudyOS (adopted by 850+ university students), Gemini Pro Chat App (sub-150ms streaming), and Neural Path Runner (60 FPS WebGL runner).";
      } else if (lower.includes('available') || lower.includes('status') || lower.includes('roles')) {
        reply =
          "Yes! Sharad is actively open to full-time roles, high-impact consulting, and founding engineer opportunities. His target roles include AI Engineer, Backend Engineer, and Full-Stack AI Engineer.";
      } else if (lower.includes('resume') || lower.includes('cv')) {
        reply =
          "I've opened Sharad's ATS-compliant resume modal for you. You can preview all verified credentials or print it directly to PDF.";
      } else if (retrieved.length > 0 && retrieved[0].score > 0.2) {
        reply = retrieved[0].chunk.content;
      } else {
        reply =
          "Sharad is an AI & Backend Engineer, Founder of MacroPing, and Co-founder of Infonix Cloud. Feel free to ask about MacroPing, his 9.50 6th sem CGPA, his autonomous AI systems, or his 500+ LeetCode solutions!";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          sender: 'assistant',
          text: reply,
          sourceTags: sourceTags.slice(0, 2),
          actionChips: chips,
          cards: cards.length > 0 ? cards : undefined,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setIsTyping(false);
    }, 450);
  };

  return (
    <>
      {/* Architectural Precision Launcher */}
      {!isOpen && (
        <button
          type="button"
          onClick={onOpen}
          className="fixed bottom-6 right-6 z-40 group flex items-center gap-3 px-4 py-3 bg-zinc-900 text-white dark:bg-[#16181D] dark:text-zinc-100 border border-zinc-300 dark:border-white/15 rounded-full shadow-xl hover:border-blue-500/60 transition-all hover:scale-105 active:scale-95"
          aria-label="Open Ask Sharad AI Assistant"
        >
          <div className="relative flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-blue-400 group-hover:rotate-12 transition-transform duration-300" />
          </div>
          <span className="text-xs font-semibold tracking-wide">
            Ask Sharad
          </span>
          <span className="hidden md:inline text-[10px] text-zinc-400 font-mono bg-white/10 px-1.5 py-0.5 rounded border border-white/10">
            {typeof window !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0 ? '⌘K' : 'Ctrl+K'}
          </span>
        </button>
      )}

      {/* Floating Glassmorphism Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] max-h-[620px] h-[85vh] flex flex-col bg-white/98 dark:bg-[#111317]/98 text-zinc-900 dark:text-zinc-100 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="p-4 border-b border-zinc-200 dark:border-white/10 flex items-center justify-between bg-zinc-50 dark:bg-white/[0.02]">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-blue-500/10 dark:bg-blue-500/15 border border-blue-500/25">
                <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                  <span>Ask Sharad</span>
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-mono font-medium bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20">
                    Gemini 3.8 Flash
                  </span>
                </h3>
                <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  Autonomous Multi-Turn Portfolio Agent
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <span className="hidden sm:inline-block text-[10px] text-zinc-400 dark:text-zinc-500 font-mono px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10">
                Esc
              </span>
              <button
                type="button"
                onClick={handleClearChat}
                className="p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-lg transition-colors"
                title="Clear chat history"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-lg transition-colors"
                aria-label="Close assistant"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs bg-zinc-50/40 dark:bg-transparent">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-6 h-6 rounded-md bg-blue-500/10 dark:bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  </div>
                )}

                <div className="max-w-[85%] space-y-2">
                  {/* Action Chips */}
                  {msg.actionChips && msg.actionChips.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {msg.actionChips.map((chip, cIdx) => (
                        <span
                          key={cIdx}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                        >
                          <CornerDownRight className="w-3 h-3" />
                          <span>{chip}</span>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div
                    className={`p-3 rounded-xl leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-blue-600 text-white font-medium shadow-sm'
                        : 'bg-white dark:bg-white/[0.05] text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-white/[0.08] shadow-sm'
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* Render Embedded Project Cards in Chat */}
                  {msg.cards && msg.cards.length > 0 && (
                    <div className="space-y-2 pt-1">
                      {msg.cards.map((card, idx) => (
                        <div
                          key={idx}
                          onClick={() => onOpenProjectModal(card.data)}
                          className="p-2.5 rounded-lg bg-zinc-100 dark:bg-black/40 border border-zinc-200 dark:border-white/10 hover:border-blue-500/40 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center justify-between text-zinc-900 dark:text-zinc-300 font-bold mb-1">
                            <span>{card.data.title}</span>
                            <ExternalLink className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                          </div>
                          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-1">
                            {card.data.tagline}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Source Tags */}
                  {msg.sourceTags && msg.sourceTags.length > 0 && (
                    <div className="flex flex-wrap gap-1 text-[10px] text-zinc-400 dark:text-zinc-500 font-mono">
                      {msg.sourceTags.map((tag, tIdx) => (
                        <span key={tIdx} className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Message Timestamp & Accessibility Read Aloud Button */}
                  <div className="flex items-center justify-between text-[10px] text-zinc-400 dark:text-zinc-500 pt-1 font-mono">
                    <span>{msg.timestamp}</span>
                    {msg.sender === 'assistant' && (
                      <button
                        type="button"
                        onClick={() => speakCustomText(msg.text, 'Ask Sharad Response')}
                        className="hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 transition-colors text-zinc-400"
                        title="Read this response aloud with Web Speech API"
                      >
                        <Volume2 className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                        <span>Listen</span>
                      </button>
                    )}
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-6 h-6 rounded-md bg-zinc-200 dark:bg-white/10 border border-zinc-300 dark:border-white/20 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-300" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-xs">
                <Bot className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span className="animate-pulse">Retrieving grounded context & drafting response...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Starter Prompt Chips */}
          <div className="px-4 py-2 border-t border-zinc-200 dark:border-white/[0.06] bg-zinc-100/70 dark:bg-black/30 overflow-x-auto">
            <div className="flex gap-1.5 whitespace-nowrap">
              {STARTER_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => handleSend(prompt)}
                  className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-white dark:bg-white/[0.04] hover:bg-zinc-200 dark:hover:bg-white/[0.1] text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white border border-zinc-200 dark:border-white/[0.08] transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Input Footer */}
          <div className="p-3 border-t border-zinc-200 dark:border-white/10 bg-white dark:bg-[#111317]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about systems, experience, or projects..."
                className="flex-1 px-3.5 py-2 text-xs bg-zinc-50 dark:bg-white/[0.05] border border-zinc-300 dark:border-white/10 rounded-xl text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
              />

              <button
                type="button"
                onClick={toggleVoiceInput}
                className={`p-2 rounded-xl border transition-colors ${
                  isListening
                    ? 'bg-red-500/20 border-red-500 text-red-500 animate-pulse'
                    : 'bg-zinc-100 dark:bg-white/[0.04] border-zinc-300 dark:border-white/10 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                }`}
                title="Voice input via Web Speech API"
              >
                {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </button>

              <button
                type="submit"
                disabled={!input.trim()}
                className="p-2 text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-40 rounded-xl transition-all shadow-sm"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

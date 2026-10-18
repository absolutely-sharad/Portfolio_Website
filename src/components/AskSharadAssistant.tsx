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
} from 'lucide-react';

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
}

const STARTER_PROMPTS = [
  'Why hire Sharad?',
  'Show AI projects',
  'What did he build at Infonix Cloud?',
  'Take me to experience',
  'Is he available for hire?',
  'Download resume',
];

export const AskSharadAssistant: React.FC<AskSharadAssistantProps> = ({
  isOpen,
  onClose,
  onOpen,
  onNavigateToSection,
  onOpenProjectModal,
  onOpenResumeModal,
}) => {
  const [messages, setMessages] = useState<Message[]>(() => {
    return [
      {
        id: 'welcome',
        sender: 'assistant',
        text: "Hi! I'm Sharad's AI Assistant. I can answer technical questions about his work, impact numbers, and systems architecture, or navigate the portfolio for you.",
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

    // 1. Tool: navigateTo
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
      }

      onNavigateToSection(targetSection);
      chips.push(`Scrolled to ${targetSection.toUpperCase()} ↓`);
    }

    // 2. Tool: openProject
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

    // 3. Tool: downloadResume
    if (
      toolCallName === 'downloadResume' ||
      lower.includes('resume') ||
      lower.includes('cv') ||
      lower.includes('download')
    ) {
      onOpenResumeModal();
      chips.push('Opened ATS Resume Modal 📄');
    }

    // 4. Tool: showCards
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
      // 2. Try Server-Side API Call with Gemini
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: promptText,
          context: contextText,
          history: messages.slice(-4).map((m) => ({ role: m.sender, content: m.text })),
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
          "Sharad combines strong theoretical computer science rigor (9.17/10 CGPA, 500+ LeetCode problems) with proven startup velocity. At Infonix Cloud, he engineered autonomous Gemini AI agents that cut customer response times by ~30% and delivered production workflows for 60+ business clients.";
      } else if (lower.includes('infonix')) {
        reply =
          "At Infonix Cloud, Sharad is Co-founder & Software Developer. He engineered a Gemini-based AI agent for customer support and lead qualification (~30% faster response), automated business operations for 60+ companies using Python/NLP, and shipped production MVPs within 2–4 weeks.";
      } else if (lower.includes('cgpa') || lower.includes('education') || lower.includes('college')) {
        reply =
          "Sharad is pursuing his B.Tech in Computer Science & Engineering at Polaris School of Technology (Starex University), maintaining an exceptional 9.17/10 CGPA across all semesters.";
      } else if (lower.includes('project') || lower.includes('built')) {
        reply =
          "Sharad has built several high-impact systems including AI Job-Hunt Copilot (which cut application time by 75%), StudyOS (adopted by 850+ university students), Gemini Pro Chat App (sub-150ms streaming), and Village Run 3D (60 FPS WebGL runner).";
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
          "Sharad is an AI & Backend Engineer specializing in autonomous multi-agent pipelines, RAG with pgvector, and high-throughput microservices. Feel free to ask about his work at Infonix Cloud, his AI Job-Hunt Copilot, or his 500+ LeetCode solutions!";
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
      {/* Floating Cyan Orb Launcher */}
      {!isOpen && (
        <button
          type="button"
          onClick={onOpen}
          className="fixed bottom-6 right-6 z-40 group flex items-center gap-3 p-3.5 sm:px-4 sm:py-3.5 bg-[#0E1217] hover:bg-[#131922] border border-[#38BDF8]/40 hover:border-[#38BDF8] rounded-full shadow-[0_0_25px_rgba(56,189,248,0.35)] transition-all hover:scale-105"
          aria-label="Open Ask Sharad AI Assistant"
        >
          <div className="relative">
            <Sparkles className="w-5 h-5 text-[#38BDF8] animate-pulse" />
            <span className="absolute -inset-1 rounded-full bg-[#38BDF8]/20 animate-ping opacity-75" />
          </div>
          <span className="hidden sm:inline text-xs font-bold text-white tracking-wide">
            Ask Sharad
          </span>
          <span className="hidden md:inline text-[10px] text-slate-400 font-mono bg-white/10 px-1.5 py-0.5 rounded">
            ⌘K
          </span>
        </button>
      )}

      {/* Floating Glassmorphism Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] max-h-[620px] h-[85vh] flex flex-col bg-[#0E1217]/95 backdrop-blur-xl border border-white/15 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-[#38BDF8]/15 border border-[#38BDF8]/30">
                <Sparkles className="w-4 h-4 text-[#38BDF8]" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span>Ask Sharad</span>
                  <span className="text-[10px] text-[#38BDF8] font-mono font-medium bg-[#38BDF8]/10 px-1.5 py-0.2 rounded">
                    RAG Agent
                  </span>
                </h3>
                <div className="text-[11px] text-slate-400">
                  Site navigation · Technical Q&A
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleClearChat}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
                title="Clear chat history"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
                aria-label="Close assistant"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-6 h-6 rounded-md bg-[#38BDF8]/20 border border-[#38BDF8]/40 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5 text-[#38BDF8]" />
                  </div>
                )}

                <div className={`max-w-[85%] space-y-2`}>
                  {/* Action Chips */}
                  {msg.actionChips && msg.actionChips.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {msg.actionChips.map((chip, cIdx) => (
                        <span
                          key={cIdx}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-[#38BDF8]/20 text-[#38BDF8] border border-[#38BDF8]/35"
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
                        ? 'bg-[#38BDF8] text-[#08090C] font-medium'
                        : 'bg-white/[0.05] text-slate-200 border border-white/[0.08]'
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
                          className="p-2.5 rounded-lg bg-black/40 border border-white/10 hover:border-[#38BDF8]/40 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center justify-between text-slate-300 font-bold mb-1">
                            <span>{card.data.title}</span>
                            <ExternalLink className="w-3 h-3 text-[#38BDF8]" />
                          </div>
                          <p className="text-[11px] text-slate-400 line-clamp-1">
                            {card.data.tagline}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Source Tags */}
                  {msg.sourceTags && msg.sourceTags.length > 0 && (
                    <div className="flex flex-wrap gap-1 text-[10px] text-slate-500 font-mono">
                      {msg.sourceTags.map((tag, tIdx) => (
                        <span key={tIdx} className="hover:text-slate-300 transition-colors">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-6 h-6 rounded-md bg-white/10 border border-white/20 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5 text-slate-300" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-slate-400 text-xs">
                <Bot className="w-4 h-4 text-[#38BDF8]" />
                <span className="animate-pulse">Retrieving grounded context & drafting response...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Starter Prompt Chips */}
          <div className="px-4 py-2 border-t border-white/[0.06] bg-black/30 overflow-x-auto">
            <div className="flex gap-1.5 whitespace-nowrap">
              {STARTER_PROMPTS.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => handleSend(prompt)}
                  className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-white/[0.04] hover:bg-white/[0.1] text-slate-300 hover:text-white border border-white/[0.08] transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Input Footer */}
          <div className="p-3 border-t border-white/10 bg-[#0E1217]">
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
                className="flex-1 px-3.5 py-2 text-xs bg-white/[0.05] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#38BDF8] transition-colors"
              />

              <button
                type="button"
                onClick={toggleVoiceInput}
                className={`p-2 rounded-xl border transition-colors ${
                  isListening
                    ? 'bg-red-500/20 border-red-500 text-red-400 animate-pulse'
                    : 'bg-white/[0.04] border-white/10 text-slate-400 hover:text-white'
                }`}
                title="Voice input via Web Speech API"
              >
                {isListening ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </button>

              <button
                type="submit"
                disabled={!input.trim()}
                className="p-2 text-[#08090C] bg-[#38BDF8] hover:bg-[#7dd3fc] disabled:opacity-40 rounded-xl transition-all"
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

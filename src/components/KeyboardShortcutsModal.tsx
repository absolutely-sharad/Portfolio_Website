import React from 'react';
import { X, Command, Sparkles, Layers, FileText, Film, Eye, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext.tsx';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ShortcutItem {
  keys: string[];
  action: string;
  description: string;
  icon: React.ReactNode;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { isLight } = useTheme();

  const isMac =
    typeof window !== 'undefined' &&
    navigator.platform.toUpperCase().indexOf('MAC') >= 0;

  const shortcuts: ShortcutItem[] = [
    {
      keys: [isMac ? '⌘' : 'Ctrl', 'K'],
      action: 'Ask Sharad Assistant',
      description: 'Open or close the autonomous Gemini 3.8 Flash AI recruiter assistant',
      icon: <Sparkles className="w-3.5 h-3.5 text-blue-500" />,
    },
    {
      keys: ['Esc'],
      action: 'Close Any Modal',
      description: 'Dismiss active project deep dives, 3D runner, resume, or AI assistant',
      icon: <X className="w-3.5 h-3.5 text-rose-400" />,
    },
    {
      keys: ['?'],
      action: 'Keyboard Shortcuts',
      description: 'Toggle this keyboard shortcut helper sheet from anywhere',
      icon: <Command className="w-3.5 h-3.5 text-amber-400" />,
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className={`relative max-w-md w-full rounded-2xl border p-6 shadow-2xl overflow-hidden ${
              isLight
                ? 'bg-white border-zinc-200 text-zinc-800'
                : 'bg-[#131519] border-white/10 text-white'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Command className="w-4 h-4" />
                </div>
                <div>
                  <h3 className={`text-base font-bold ${isLight ? 'text-zinc-900' : 'text-white'}`}>
                    Keyboard Shortcuts
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    Efficient global navigation controls
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors"
                aria-label="Close shortcuts modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Shortcut List */}
            <div className="space-y-3 mb-6">
              {shortcuts.map((item, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border flex items-center justify-between gap-3 ${
                    isLight
                      ? 'bg-zinc-50 border-zinc-200'
                      : 'bg-white/[0.03] border-white/[0.06]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="shrink-0">{item.icon}</div>
                    <div>
                      <div className={`text-xs font-semibold ${isLight ? 'text-zinc-900' : 'text-zinc-200'}`}>
                        {item.action}
                      </div>
                      <div className="text-[10px] text-zinc-400 leading-tight">
                        {item.description}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {item.keys.map((k, kIdx) => (
                      <kbd
                        key={kIdx}
                        className={`px-2 py-1 rounded-md text-[11px] font-mono font-bold border shadow-sm ${
                          isLight
                            ? 'bg-white text-zinc-800 border-zinc-300'
                            : 'bg-white/10 text-white border-white/20'
                        }`}
                      >
                        {k}
                      </kbd>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer Tip */}
            <div
              className={`pt-3 border-t flex items-center justify-between text-[11px] ${
                isLight ? 'border-zinc-200 text-zinc-500' : 'border-white/[0.08] text-zinc-400'
              }`}
            >
              <span>Press <kbd className="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-white/10 font-mono text-zinc-800 dark:text-white text-[10px]">Esc</kbd> anytime to dismiss</span>
              <span className="font-mono text-blue-600 dark:text-blue-400">Sharad.dev</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

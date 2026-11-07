import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
  text: string;
  label?: string;
  successLabel?: string;
  variant?: 'icon' | 'badge' | 'button';
  className?: string;
  title?: string;
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  text,
  label,
  successLabel = 'Copied!',
  variant = 'icon',
  className = '',
  title = 'Copy to clipboard',
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-999999px';
        textarea.style.top = '-999999px';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn('Failed to copy to clipboard:', err);
    }
  };

  if (variant === 'badge') {
    return (
      <button
        type="button"
        onClick={handleCopy}
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-mono font-medium transition-all border shrink-0 focus:outline-none focus:ring-1 focus:ring-[#6366F1] ${
          copied
            ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
            : 'bg-white hover:bg-zinc-100 dark:bg-white/[0.06] dark:hover:bg-white/[0.12] text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-white/10'
        } ${className}`}
        title={copied ? successLabel : title}
        aria-label={copied ? successLabel : title}
      >
        {copied ? (
          <Check className="w-3 h-3 text-emerald-500 shrink-0" />
        ) : (
          <Copy className="w-3 h-3 text-zinc-400 shrink-0" />
        )}
        <span>{copied ? successLabel : label || 'Copy'}</span>
      </button>
    );
  }

  if (variant === 'button') {
    return (
      <button
        type="button"
        onClick={handleCopy}
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all border shrink-0 focus:outline-none focus:ring-2 focus:ring-[#6366F1]/30 ${
          copied
            ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
            : 'bg-white hover:bg-zinc-50 dark:bg-white/[0.06] dark:hover:bg-white/[0.1] text-zinc-700 dark:text-zinc-200 border-zinc-200 dark:border-white/10'
        } ${className}`}
        title={copied ? successLabel : title}
        aria-label={copied ? successLabel : title}
      >
        {copied ? (
          <Check className="w-3.5 h-3.5 text-white shrink-0" />
        ) : (
          <Copy className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
        )}
        <span>{copied ? successLabel : label || 'Copy'}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`p-1 rounded-md transition-all text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/10 focus:outline-none ${
        copied ? 'text-emerald-500 dark:text-emerald-400' : ''
      } ${className}`}
      title={copied ? successLabel : title}
      aria-label={copied ? successLabel : title}
    >
      {copied ? (
        <Check className="w-3.5 h-3.5 text-emerald-500" />
      ) : (
        <Copy className="w-3.5 h-3.5" />
      )}
    </button>
  );
};

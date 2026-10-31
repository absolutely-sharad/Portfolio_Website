/**
 * Utility for calculating estimated reading time and word counts.
 * Standard average reading speed: ~200-225 words per minute.
 */

export interface ReadingTimeResult {
  minutes: number;
  words: number;
  text: string;
  badgeText: string;
}

export function calculateReadingTime(
  content: string | (string | undefined | null)[],
  wordsPerMinute = 200
): ReadingTimeResult {
  const textArray = Array.isArray(content)
    ? content.filter((item): item is string => Boolean(item))
    : [content || ''];

  const combined = textArray.join(' ');
  // Split on whitespace after normalizing punctuation
  const words = combined
    .trim()
    .replace(/[^\w\s-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length;

  const minutes = Math.max(1, Math.ceil(words / wordsPerMinute));
  const text = `~${minutes} min read`;
  const badgeText = `${text} (${words} words)`;

  return {
    minutes,
    words,
    text,
    badgeText,
  };
}

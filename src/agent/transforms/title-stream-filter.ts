import {
  SESSION_TITLE_TAG_REGEX,
  INCOMPLETE_SESSION_TITLE_TAG_REGEX,
  sanitizeAgentText,
} from './sanitizer';

export { SESSION_TITLE_TAG_REGEX, INCOMPLETE_SESSION_TITLE_TAG_REGEX, sanitizeAgentText };

const DEFAULT_SESSION_TITLES = ['Active Session', 'General Inquiry', 'New Chat', 'Chat', 'Active Chat'] as const;

/**
 * Checks if a session title matches a placeholder / default name.
 */
export function isDefaultSessionTitle(title?: string | null): boolean {
  if (!title) return true;
  return (DEFAULT_SESSION_TITLES as readonly string[]).includes(title);
}

/**
 * Result of extracting a session title from raw agent output
 */
export interface ExtractedTitleResult {
  sessionTitle?: string;
  cleanedText: string;
}

/**
 * Generates an intelligent, natural 2-4 word session title from the user prompt.
 */
export function generateFallbackSessionTitle(prompt: string): string {
  const cleanPrompt = (prompt || '').trim();
  if (!cleanPrompt) return 'New Conversation';

  const cleanedWords = cleanPrompt
    .replace(/[^\w\s-]/g, '')
    .split(/\s+/)
    .filter(Boolean);

  if (cleanedWords.length === 0) return 'New Conversation';

  const titleWords = cleanedWords.slice(0, 4);
  return titleWords
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Extracts and removes <session_title> tags from accumulated agent text.
 */
export function extractSessionTitle(
  rawText: string,
  fallbackTitle?: string,
  prompt?: string,
  isFirstTurn?: boolean
): ExtractedTitleResult {
  const titleMatch =
    rawText.match(/<session_title>([\s\S]*?)<\/session_title>/i) ||
    rawText.match(/<title>([\s\S]*?)<\/title>/i) ||
    rawText.match(/\[session_title:\s*([^\]]+)\]/i) ||
    rawText.match(/<session_title>([^\n<]+)/i);

  const rawTitle = titleMatch ? titleMatch[1].trim() : undefined;
  let sessionTitle =
    fallbackTitle ?? (rawTitle ? rawTitle.replace(/^["'`]+|["'`]+$/g, '').trim() : undefined);

  if (!sessionTitle && isFirstTurn && prompt) {
    sessionTitle = generateFallbackSessionTitle(prompt);
  }

  let cleanedText = rawText
    .replace(/<session_title>[\s\S]*?<\/session_title>\s*/gi, '')
    .replace(/<title>[\s\S]*?<\/title>\s*/gi, '')
    .replace(/\[session_title:\s*[^\]]+\]\s*/gi, '')
    .replace(/<session_title>[^\n<]*\n?/gi, '')
    .trim();

  if (!cleanedText && sessionTitle) {
    cleanedText = `Started a new chat for **${sessionTitle}**. What would you like to explore today?`;
  }

  return { sessionTitle, cleanedText };
}

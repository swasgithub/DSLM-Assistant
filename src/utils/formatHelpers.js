import { C } from '../styles/theme';

/** Convert **bold** markdown to <strong> tags */
export function boldMarkdown(text) {
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
}

/** Truncate a string with ellipsis */
export function truncate(str, max = 80) {
  return str.length > max ? str.slice(0, max) + '…' : str;
}

/** Map a 0-100 score to a semantic colour */
export function scoreColor(score) {
  if (score >= 90) return C.green;
  if (score >= 75) return C.accent;
  if (score >= 60) return C.amber;
  return C.coral;
}

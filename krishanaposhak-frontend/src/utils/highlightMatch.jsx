import React from 'react';

/**
 * Wraps occurrences of query in text with highlighted JSX spans.
 * Case-insensitive match.
 *
 * @param {string} text - The full string to display
 * @param {string} query - The search query term
 * @returns {React.ReactNode} - Formatted JSX with highlighted terms
 */
export function highlightMatch(text = '', query = '') {
  if (!text) return '';
  if (!query || !query.trim()) return text;

  const cleanQuery = query.trim();
  // Escape regex special characters in query
  const escapedQuery = cleanQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapedQuery})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, index) =>
    regex.test(part) ? (
      <mark
        key={index}
        className="bg-amber-400/30 text-amber-300 font-bold px-0.5 rounded border-b border-amber-400/50"
      >
        {part}
      </mark>
    ) : (
      part
    )
  );
}

export default highlightMatch;

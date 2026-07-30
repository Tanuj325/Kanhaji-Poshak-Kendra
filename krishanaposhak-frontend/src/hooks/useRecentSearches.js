import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'kp_recent_searches';
const MAX_RECENT_SEARCHES = 10;

/**
 * Custom hook to store and manage recent search queries in LocalStorage.
 * Keeps up to 10 unique, non-empty search terms.
 */
export function useRecentSearches() {
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync state to localStorage whenever it updates
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recentSearches));
    } catch {
      // Ignore write errors (e.g. incognito mode restrictions)
    }
  }, [recentSearches]);

  const addSearchTerm = useCallback((term) => {
    if (!term || typeof term !== 'string') return;
    const cleanTerm = term.trim();
    if (!cleanTerm) return;

    setRecentSearches((prev) => {
      // Filter out duplicate case-insensitive term and prepend cleanTerm
      const filtered = prev.filter(
        (item) => item.toLowerCase() !== cleanTerm.toLowerCase()
      );
      return [cleanTerm, ...filtered].slice(0, MAX_RECENT_SEARCHES);
    });
  }, []);

  const removeSearchTerm = useCallback((termToRemove) => {
    setRecentSearches((prev) =>
      prev.filter((item) => item !== termToRemove)
    );
  }, []);

  const clearAllSearches = useCallback(() => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  }, []);

  return {
    recentSearches,
    addSearchTerm,
    removeSearchTerm,
    clearAllSearches,
  };
}

export default useRecentSearches;

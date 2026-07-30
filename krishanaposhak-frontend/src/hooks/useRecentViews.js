import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'kp_recently_viewed';
const MAX_ITEMS = 10;

export function useRecentViews() {
  const [recentViews, setRecentViews] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setRecentViews(JSON.parse(stored));
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const addToRecentViews = useCallback((product) => {
    if (!product || !product.id) return;

    setRecentViews((prev) => {
      const filtered = prev.filter((p) => p.id !== product.id);
      const updated = [product, ...filtered].slice(0, MAX_ITEMS);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // localStorage full or unavailable
      }
      return updated;
    });
  }, []);

  return { recentViews, addToRecentViews };
}

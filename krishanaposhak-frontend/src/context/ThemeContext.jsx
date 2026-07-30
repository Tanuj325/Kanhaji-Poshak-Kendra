import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'krishanaposhak-theme';
const THEMES = { LIGHT: 'light', DARK: 'dark', SYSTEM: 'system' };

function getSystemTheme() {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getInitialTheme() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && Object.values(THEMES).includes(stored)) return stored;
  } catch {}
  return THEMES.SYSTEM;
}

function resolveTheme(themePreference) {
  if (themePreference === THEMES.SYSTEM) return getSystemTheme();
  return themePreference;
}

const ThemeContext = createContext(null);

export function ThemeProvider({ children, defaultTheme = THEMES.SYSTEM }) {
  const [themePreference, setThemePreference] = useState(() => defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState(() => resolveTheme(defaultTheme));

  // Apply theme class to document
  useEffect(() => {
    const root = document.documentElement;
    const active = resolveTheme(themePreference);
    setResolvedTheme(active);

    if (active === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [themePreference]);

  // Listen for system theme changes when in SYSTEM mode
  useEffect(() => {
    if (themePreference !== THEMES.SYSTEM) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      const root = document.documentElement;
      const active = getSystemTheme();
      setResolvedTheme(active);
      if (active === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [themePreference]);

  const setTheme = useCallback((newTheme) => {
    if (!Object.values(THEMES).includes(newTheme)) return;
    setThemePreference(newTheme);
    try {
      localStorage.setItem(STORAGE_KEY, newTheme);
    } catch {}
  }, []);

  const toggleTheme = useCallback(() => {
    const current = resolveTheme(themePreference);
    const next = current === 'dark' ? THEMES.LIGHT : THEMES.DARK;
    setTheme(next);
  }, [themePreference, setTheme]);

  const value = {
    themePreference,
    resolvedTheme,
    isDark: resolvedTheme === 'dark',
    isLight: resolvedTheme === 'light',
    isSystem: themePreference === THEMES.SYSTEM,
    setTheme,
    toggleTheme,
    THEMES,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return ctx;
}

export default ThemeContext;

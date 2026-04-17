import React, { createContext, useContext, useEffect, useState } from 'react';

export type Theme = 'dark' | 'light';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = 'theme';

function readStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'dark' || stored === 'light') {
      return stored;
    }
  } catch {
    // localStorage unavailable (e.g. private browsing restrictions)
  }
  return 'dark';
}

function writeStoredTheme(theme: Theme): void {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // localStorage unavailable — fall back to in-memory state only
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(readStoredTheme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  function toggleTheme() {
    setTheme((prev) => {
      const next: Theme = prev === 'dark' ? 'light' : 'dark';
      writeStoredTheme(next);
      return next;
    });
  }

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (ctx === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
}

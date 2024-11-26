'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from './theme-provider';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="hover:bg-primary-100 dark:hover:bg-primary-800 rounded-lg p-2 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? (
        <Moon className="text-primary-800 dark:text-primary-100 h-5 w-5" />
      ) : (
        <Sun className="text-primary-800 dark:text-primary-100 h-5 w-5" />
      )}
    </button>
  );
}

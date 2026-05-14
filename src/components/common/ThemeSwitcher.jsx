import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      title={`Switch to ${theme === 'black-white' ? 'Blue & Beige' : 'Black & White'} theme`}
      aria-label="Toggle theme"
    >
      {theme === 'black-white' ? (
        <>
          <Sun size={18} className="text-yellow-500" />
          <span className="text-xs font-medium hidden sm:inline">Blue & Beige</span>
        </>
      ) : (
        <>
          <Moon size={18} className="text-blue-600" />
          <span className="text-xs font-medium hidden sm:inline">Black & White</span>
        </>
      )}
    </button>
  );
}

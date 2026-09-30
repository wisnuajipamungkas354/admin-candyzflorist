import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';

export default function ThemeToggle({ variant = "outline", className = "" }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant={variant}
      size="icon"
      onClick={toggleTheme}
      className={`rounded-full transition-all duration-200 ${className}`}
      title={theme === 'dark' ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="h-4 w-4 text-amber-400 transition-all hover:rotate-45" />
      ) : (
        <Moon className="h-4 w-4 text-slate-700 transition-all hover:-rotate-12" />
      )}
    </Button>
  );
}

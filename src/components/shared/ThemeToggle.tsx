import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '@/store/themeStore';
import { Button } from '@/components/ui/Button';

export function ThemeToggle() {
  const { isDark, toggleTheme } = useThemeStore();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="rounded-full w-10 h-10"
    >
      {isDark ? (
        <Moon className="h-5 w-5 text-gray-300 hover:text-white transition-colors" />
      ) : (
        <Sun className="h-5 w-5 text-gray-600 hover:text-gray-900 transition-colors" />
      )}
    </Button>
  );
}

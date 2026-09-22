import { create } from 'zustand';

interface ThemeState {
  isDark: boolean;
  toggle: () => void;
  toggleTheme: () => void;
  setDark: (dark: boolean) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  isDark: false,
  toggle: () => set((state) => {
    const newDark = !state.isDark;
    if (newDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('smartcare-theme', newDark ? 'dark' : 'light');
    return { isDark: newDark };
  }),
  toggleTheme: () => set((state) => {
    const newDark = !state.isDark;
    if (newDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('smartcare-theme', newDark ? 'dark' : 'light');
    return { isDark: newDark };
  }),
  setDark: (dark: boolean) => {
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('smartcare-theme', dark ? 'dark' : 'light');
    set({ isDark: dark });
  },
}));

// Initialize theme from localStorage, default to light mode
const savedTheme = typeof window !== 'undefined' ? localStorage.getItem('smartcare-theme') : null;
if (savedTheme === 'dark') {
  document.documentElement.classList.add('dark');
  useThemeStore.getState().setDark(true);
} else {
  document.documentElement.classList.remove('dark');
  useThemeStore.getState().setDark(false);
}

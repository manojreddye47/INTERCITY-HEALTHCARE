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
    set({ isDark: dark });
  },
}));

// Initialize theme from localStorage
const savedTheme = localStorage.getItem('smartcare-theme');
if (savedTheme === 'dark') {
  document.documentElement.classList.add('dark');
  useThemeStore.getState().setDark(true);
}

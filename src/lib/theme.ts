import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Theme = 'light' | 'dark' | 'system';

interface ThemeStore {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const useTheme = create<ThemeStore>()(
  persist(
    (set) => ({
      theme: 'system',
      setTheme: (theme) => {
        set({ theme });
        updateTheme(theme);
      },
    }),
    {
      name: 'theme-storage',
    }
  )
);

// Mettre à jour le thème dans le DOM
const updateTheme = (theme: Theme) => {
  const root = window.document.documentElement;
  root.classList.remove('light', 'dark');

  if (theme === 'system') {
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
    root.classList.add(systemTheme);
  } else {
    root.classList.add(theme);
  }
};

// Écouter les changements de thème système
if (typeof window !== 'undefined') {
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', (e) => {
      const theme = useTheme.getState().theme;
      if (theme === 'system') {
        updateTheme('system');
      }
    });
}

// Initialiser le thème
const initTheme = () => {
  const theme = useTheme.getState().theme;
  updateTheme(theme);
};

// Exporter la fonction d'initialisation
export { initTheme };

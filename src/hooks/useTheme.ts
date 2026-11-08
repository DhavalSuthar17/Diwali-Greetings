import { useCallback, useMemo, useState } from 'react';
import { THEMES_LIST } from '../data/mockData';
import type { ThemeConfig, UseThemeReturn } from '../types';

/**
 * Hook to manage and cycle through the 4 atmospheric lighting themes:
 * 1. Golden Glow (#F5B83D)
 * 2. Warm Ember (#FF8A1F)
 * 3. Emerald & Ruby (#3DDC84)
 * 4. Festive Aurora (#E040C8)
 *
 * @param initialIndex Optional starting theme index (0-3, default 0: Golden Glow)
 * @returns { theme: ThemeConfig; themeIndex: number; cycleTheme: () => void; setThemeIndex: (index: number) => void }
 */
export function useTheme(initialIndex = 0): UseThemeReturn {
  const [themeIndex, setThemeIndexState] = useState<number>(() => {
    const clamped = Math.floor(initialIndex);
    return clamped >= 0 && clamped < THEMES_LIST.length ? clamped : 0;
  });

  const cycleTheme = useCallback(() => {
    setThemeIndexState((prevIndex) => (prevIndex + 1) % THEMES_LIST.length);
  }, []);

  const setThemeIndex = useCallback((index: number) => {
    if (index >= 0 && index < THEMES_LIST.length) {
      setThemeIndexState(index);
    }
  }, []);

  const theme: ThemeConfig = useMemo(() => {
    return THEMES_LIST[themeIndex] || THEMES_LIST[0];
  }, [themeIndex]);

  return {
    theme,
    themeIndex,
    cycleTheme,
    setThemeIndex,
  };
}

export default useTheme;

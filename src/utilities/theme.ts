import type { Theme } from '../types';

export const THEME_STORAGE_KEY = 'metricflow-theme';

export function getInitialTheme(
  storage: Pick<Storage, 'getItem'> | undefined =
    typeof window === 'undefined' ? undefined : window.localStorage
): Theme {
  try {
    return storage?.getItem(THEME_STORAGE_KEY) === 'light' ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

export function persistTheme(
  theme: Theme,
  storage: Pick<Storage, 'setItem'> | undefined =
    typeof window === 'undefined' ? undefined : window.localStorage
): void {
  try {
    storage?.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Theme state remains usable when browser storage is unavailable.
  }
}

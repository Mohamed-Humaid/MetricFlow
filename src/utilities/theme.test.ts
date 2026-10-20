import { describe, expect, it } from 'vitest';
import { getInitialTheme, persistTheme, THEME_STORAGE_KEY } from './theme';

describe('theme persistence', () => {
  it('reads light preference and defaults safely to dark', () => {
    const storage = { getItem: (key: string) => (key === THEME_STORAGE_KEY ? 'light' : null) };
    expect(getInitialTheme(storage)).toBe('light');
    expect(getInitialTheme({ getItem: () => 'invalid' })).toBe('dark');
  });

  it('persists the selected theme', () => {
    let savedKey = '';
    let savedValue = '';
    persistTheme('light', {
      setItem: (key, value) => {
        savedKey = key;
        savedValue = value;
      },
    });
    expect(savedKey).toBe(THEME_STORAGE_KEY);
    expect(savedValue).toBe('light');
  });

  it('falls back when storage throws', () => {
    expect(() => getInitialTheme({ getItem: () => { throw new Error('blocked'); } })).not.toThrow();
    expect(() => persistTheme('dark', { setItem: () => { throw new Error('blocked'); } })).not.toThrow();
  });
});

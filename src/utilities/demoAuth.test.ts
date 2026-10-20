import { describe, expect, it } from 'vitest';
import {
  DEMO_SESSION_KEY,
  readDemoSession,
  validateDemoCredentials,
  writeDemoSession,
} from './demoAuth';

describe('demo authentication', () => {
  it('accepts only the exact demo credentials', () => {
    expect(validateDemoCredentials('admin', 'admin')).toBe(true);
    expect(validateDemoCredentials('Admin', 'admin')).toBe(false);
    expect(validateDemoCredentials('admin', 'Admin')).toBe(false);
    expect(validateDemoCredentials('', '')).toBe(false);
  });

  it('writes, reads and clears only the session flag', () => {
    const values = new Map<string, string>();
    const storage = {
      getItem: (key: string) => values.get(key) ?? null,
      setItem: (key: string, value: string) => values.set(key, value),
      removeItem: (key: string) => values.delete(key),
    };

    writeDemoSession(true, storage);
    expect(values.get(DEMO_SESSION_KEY)).toBe('authenticated');
    expect(readDemoSession(storage)).toBe(true);
    expect(values.has('password')).toBe(false);

    writeDemoSession(false, storage);
    expect(readDemoSession(storage)).toBe(false);
  });
});

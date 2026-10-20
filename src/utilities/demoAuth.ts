export const DEMO_SESSION_KEY = 'metricflow-demo-session';
export const DEMO_USERNAME = 'admin';
export const DEMO_PASSWORD = 'admin';

export function validateDemoCredentials(username: string, password: string): boolean {
  return username === DEMO_USERNAME && password === DEMO_PASSWORD;
}

export function readDemoSession(
  storage: Pick<Storage, 'getItem'> | undefined =
    typeof window === 'undefined' ? undefined : window.sessionStorage
): boolean {
  try {
    return storage?.getItem(DEMO_SESSION_KEY) === 'authenticated';
  } catch {
    return false;
  }
}

export function writeDemoSession(
  authenticated: boolean,
  storage: Pick<Storage, 'setItem' | 'removeItem'> | undefined =
    typeof window === 'undefined' ? undefined : window.sessionStorage
): void {
  try {
    if (authenticated) {
      storage?.setItem(DEMO_SESSION_KEY, 'authenticated');
    } else {
      storage?.removeItem(DEMO_SESSION_KEY);
    }
  } catch {
    // The auth context remains usable for the current tab.
  }
}

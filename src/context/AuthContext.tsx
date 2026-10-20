import React, { createContext, useContext, useState, type ReactNode } from 'react';
import {
  DEMO_PASSWORD,
  DEMO_USERNAME,
  readDemoSession,
  validateDemoCredentials,
  writeDemoSession,
} from '../utilities/demoAuth';

interface AuthContextValue {
  isAuthenticated: boolean;
  signIn: (username: string, password: string) => boolean;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(readDemoSession);

  const signIn = (username: string, password: string): boolean => {
    const isValid = validateDemoCredentials(username, password);
    if (!isValid) return false;

    writeDemoSession(true);
    setIsAuthenticated(true);
    return true;
  };

  const signOut = () => {
    writeDemoSession(false);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export const DEMO_CREDENTIALS = {
  username: DEMO_USERNAME,
  password: DEMO_PASSWORD,
} as const;

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

type AuthContextValue = { isAuthenticated: boolean; login: (studentId: string, password: string) => boolean; logout: () => void };
const AuthContext = createContext<AuthContextValue | null>(null);
export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('ustudent-demo-session') === 'active');
  const value = useMemo<AuthContextValue>(() => ({
    isAuthenticated,
    login: (studentId, password) => {
      if (studentId.trim().toLowerCase() === 'stu-2026-1042' && password === 'Student@123') {
        // Demo-only session flag, not authentication security.
        localStorage.setItem('ustudent-demo-session', 'active'); setIsAuthenticated(true); return true;
      }
      return false;
    },
    logout: () => { localStorage.removeItem('ustudent-demo-session'); setIsAuthenticated(false); },
  }), [isAuthenticated]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

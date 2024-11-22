/**
 * auth.tsx
 * 
 * Manages user authentication and token storage. Provides a context for authentication 
 * state and functions for logging in, logging out, and accessing the authentication token.
 *
 * Exports:
 * - `AuthProvider`: A provider component to supply authentication state and actions.
 * - `useAuth`: A custom hook to access authentication state (token, login, logout).
 *
 * Usage:
 * - Wrap components with `AuthProvider` to supply authentication state. (This is done in app/_layout.tsx)
 * - Use `useAuth` to manage login, logout, and check authentication status.
 */
import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  login: () => void;
  logout: () => void;
  token: string | null;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);

  const login = () => {
    const fakeToken = "FAKE_TOKEN_123"; // Using a fake stoken string
    setToken(fakeToken);
  };

  const logout = () => {
    setToken(null);
  };

  const isLoggedIn = !!token;

  return (
    <AuthContext.Provider value={{ login, logout, token, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

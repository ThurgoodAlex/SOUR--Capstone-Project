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
import { router } from 'expo-router';
import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  login: (token: string) => void;
  logout: () => void;
  token: string | null;
  isLoggedIn: boolean;
}

// const getToken = () => sessionStorage.getItem("__sour_token__");
// const storeToken = (token: string) => sessionStorage.setItem("__sour_token__", token);
// const clearToken = () => sessionStorage.removeItem("__sour_token__");

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState("");

  const login = (token: string) => {
    setToken(token);
    //storeToken(token);
  };

  const logout = () => {
    setToken("");
    //clearToken();
    setTimeout(() => {
      router.replace('/LoggedOutScreen');
    }, 100);
  };

  const isLoggedIn = !!token;

  return (
    <AuthContext.Provider value={{ login,logout, token, isLoggedIn }}>
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

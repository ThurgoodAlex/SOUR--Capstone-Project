/**
 * user.tsx
 * 
 * Manages the user's state and provides a context for storing and accessing user data. 
 * Fetches the current user's information and provides it to the rest of the app.
 *
 * Exports:
 * - `UserProvider`: A provider component to supply user data context.
 * - `useUser`: A custom hook to access the user context and get user details.
 *
 * Usage:
 * - Wrap components with `UserProvider` to supply user data. (This is done in app/_layout.tsx)
 * - Use `useUser` to access the current user's information in components.
 */

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useAuth } from './auth';

interface User {
  id: string;
  name: string;
  email: string;
  isSeller: boolean;
}

const UserContext = createContext<User | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { isLoggedIn } = useAuth();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (isLoggedIn) {
      // Simulate fetching user data
      setUser({
        id: "1",
        name: "Fake User",
        email: "fakeuser@example.com",
        isSeller: false
      });
    } else {
      setUser(null);
    }
  }, [isLoggedIn]);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

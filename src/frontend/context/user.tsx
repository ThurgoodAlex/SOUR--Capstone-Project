import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useAuth } from "./auth";
import { useApi } from "@/context/api";
import { router } from "expo-router";

interface User {
  name: string;
  email: string;
  id: number;
  isSeller: boolean;
}

const UserContext = createContext<User | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { isLoggedIn, logout, token } = useAuth();
  
  const [user, setUser] = useState<User | null>(null);
  const api = useApi();

  useEffect(() => {
    const fetchUser = async () => {
      if (!isLoggedIn) {
        console.log("Exited: user not logged in");
        setUser(null);
        logout();
        return;
      }
      
      try {
        const response = await api.get("/auth/me");

        if (response.ok) {
          const responseData: { user: { username: string; email: string, id: number } } = await response.json();

          const returnedUser: User = {
            name: responseData.user.username, 
            email: responseData.user.email, 
            id: responseData.user.id,
            isSeller: true
          };

          setUser(returnedUser);
        } else {
          console.error("Failed to fetch user data:", response.statusText);
          setUser(null);
          logout();
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUser(null);
        logout();
      }
    };

    fetchUser();
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

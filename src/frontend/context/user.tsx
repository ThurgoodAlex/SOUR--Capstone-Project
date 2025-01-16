import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useAuth } from "./auth";
import { useApi } from "@/context/api";
import { router } from "expo-router";
import { User } from "@/constants/Types";



const UserContext = createContext<User | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  
  const { isLoggedIn, logout, token } = useAuth();
  console.log("TOKEN", token);
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
        console.log("RESPONSE",response);

        if (response.ok) {
          const responseData: { user: User } = await response.json();

          const returnedUser: User = {
            firstname: responseData.user.firstname, 
            lastname: responseData.user.lastname,
            username: responseData.user.username,
            id: responseData.user.id,
            profilePicture: responseData.user.profilePicture,
            isSeller: true,
            email: responseData.user.email
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

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useAuth } from "./auth";
import { useApi } from "@/context/api";
import { User } from "@/constants/Types";

// Context type includes both `user` and `setUser`
interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

// Create context with the proper type
const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { isLoggedIn, logout } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const api = useApi();

  useEffect(() => {
    const fetchUser = async () => {
      if (!isLoggedIn) {
        setUser(null);
        logout();
        return;
      }

      try {
        const response = await api.get("/auth/me/");
        if (response.ok) {
          const data = await response.json();
          const returnedUser: User = {
            firstname: data.firstname,
            lastname: data.lastname,
            username: data.username,
            id: data.id,
            profilePicture: data.profilePicture,
            isSeller: data.isSeller,
            email: data.email,
          };
          setUser(returnedUser);
        } else {
          setUser(null);
          logout();
        }
      } catch (error) {
        setUser(null);
        logout();
      }
    };

    fetchUser();
  }, [isLoggedIn]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

// export const useUser = () => {
//   const context = useContext(UserContext);
//   if (context === undefined) {
//     throw new Error("useUser must be used within a UserProvider");
//   }
//   return context;
// };
export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
      throw new Error("useUser must be used within a UserProvider");
    }
    return context; // Now includes { user, setUser }
  };

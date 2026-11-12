import { createContext, useContext, useEffect, useState } from "react";
import type { UserProfile } from "@shared/other/UserInfo.js";
import api from "../../api/index.ts";

type AuthContext = {
  isAuthenticated: boolean;
  currentUser: object | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<null | UserProfile>>;
  login: (token: string) => void;
};

type Props = {
  children: React.ReactNode;
};
const AuthContext = createContext<AuthContext | null>(null);

export function AuthProvider({ children }: Props) {
  const [currentUser, setCurrentUser] = useState<null | UserProfile>(null);
  const isAuthenticated = Boolean(localStorage.getItem("token"));

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const result = await api.users.getMyProfile();
        if (result?.success) {
          setCurrentUser(result.user);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "";
        console.error(
          `[Failed to fetch user's profile in AuthProvider] ${message}`,
        );
      }
    };

    fetchProfile();
  }, []);

  const login = (token: string) => {
    localStorage.setItem("token", token);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, currentUser, setCurrentUser, login }}
    >
      {children}
    </AuthContext.Provider>
  );
}

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("AuthContext must be used within the AuthProvider");
  }
  return context;
};

export default useAuth;

import { createContext, useContext, useEffect, useState } from "react";
import type { MyProfileResponseBody } from "@shared/api/responses/users.d.ts";
import api from "../../api/index.ts";

type AuthContext = {
  isAuthenticated: boolean;
  currentUser: object | null;
  setCurrentUser: React.Dispatch<
    React.SetStateAction<null | MyProfileResponseBody>
  >;
  login: (token: string) => void;
};

type Props = {
  children: React.ReactNode;
};
const AuthContext = createContext<AuthContext | null>(null);

export function AuthProvider({ children }: Props) {
  const [currentUser, setCurrentUser] = useState<null | MyProfileResponseBody>(
    null,
  );
  const isAuthenticated = Boolean(localStorage.getItem("token"));

  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchProfile = async () => {
      try {
        const result = await api.users.getMyProfile();
        if (result?.success) {
          setCurrentUser(result.data);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "No message";
        console.error(
          `[Failed to fetch user's profile in AuthProvider]: ${message}`,
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

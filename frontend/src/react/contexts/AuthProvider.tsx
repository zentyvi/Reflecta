import { createContext, useContext, useState } from "react";

type AuthContext = {
  currentUser: object | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<null | object>>;
  login: (token: string) => void;
};

type Props = {
  children: React.ReactNode;
};
const AuthContext = createContext<AuthContext | null>(null);

export function AuthProvider({ children }: Props) {
  const [currentUser, setCurrentUser] = useState<null | object>(null);

  const login = (token: string) => {
    localStorage.setItem("token", token);
  };

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, login }}>
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

import { useState, createContext, ReactNode, useEffect } from "react";
import { useCookies } from "react-cookie";

export interface User {
  id: number;
  name: string;
  email: string;
  picture: string;
}
interface AuthContextType {
  setIsAuthenticated: (value: boolean) => void;
  isAuthenticated: boolean;
  user: User | undefined;
}
export const AuthContext = createContext<AuthContextType>({
  setIsAuthenticated: () => {},
  isAuthenticated: false,
  user: undefined,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(undefined);
  const [cookie] = useCookies(["user"]);
  useEffect(() => {
    if (cookie.user) {
      setIsAuthenticated(true);
      setUser(cookie.user);
    }
  }, [cookie.user]);
  return (
    <AuthContext.Provider value={{ isAuthenticated, user, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

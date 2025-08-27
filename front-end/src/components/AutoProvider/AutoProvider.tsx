import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { AuthContext } from "../context/AuthContext";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Carregue o token do localStorage ao inicializar o app
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const login = (authToken: string) => {
    setToken(authToken);
    localStorage.setItem("authToken", authToken);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("authToken");
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

import { createContext, useContext, useEffect, useState } from "react";
import { Role, User } from "../types";
import { authService } from "../services/authService";
import { setAuthToken } from "../services/apiClient";
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

interface JwtPayload {
  nameid: string;
  email: string;
  unique_name: string;
  role: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const storedToken = localStorage.getItem("token");

      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      setToken(storedToken);
      setAuthToken(storedToken);

      try {
        const currentUser = await authService?.getCurrentUser();

        if (currentUser) {
          setUser(currentUser);
        }
      } catch {
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    const response = await authService?.login(email, password);

    if (!response?.token) {
      throw new Error("No token returned from login");
    }

    setToken(response.token);
    setAuthToken(response.token);
    localStorage.setItem("token", response.token);

    const currentUser = await authService?.getCurrentUser();

    if (currentUser) {
      setUser(currentUser);
    }
  };

  const logout = (): void => {
    setToken(null);
    setUser(null);
    setAuthToken(null);

    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

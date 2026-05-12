"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AUTH_SERVICE_URL =
  process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || "https://api.kyndara.ai";

interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export function useAuth(): AuthContextType {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const logout = async () => {
    const currentToken = localStorage.getItem("auth_token");
    const refreshToken = localStorage.getItem("refresh_token");

    if (currentToken && refreshToken) {
      try {
        await fetch(`${AUTH_SERVICE_URL}/auth/logout`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${currentToken}`,
          },
          body: JSON.stringify({ refreshToken }),
        });
      } catch (error) {
        console.error("Failed to notify backend of logout", error);
      }
    }

    setToken(null);
    setUser(null);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("refresh_token"); 
    localStorage.removeItem("auth_user");
    router.push("/login");
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token");
    const storedUser = localStorage.getItem("auth_user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);

    const handleSessionExpiry = () => {
      console.warn("Session expired or rejected by server. Logging out.");
      logout();
    };

    window.addEventListener("auth:unauthorized", handleSessionExpiry);
    return () => window.removeEventListener("auth:unauthorized", handleSessionExpiry);
  }, [router]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${AUTH_SERVICE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrPhone: email, password }),
      });

      const resJson = await response.json();

      if (!response.ok || !resJson.success) {
        throw new Error(resJson.error || "Invalid credentials");
      }

      const { token, refreshToken, user } = resJson.data;

      if (!user || !user.isAdmin) {
        throw new Error("Access denied. Admins only.");
      }

      setToken(token);
      setUser(user);

      localStorage.setItem("auth_token", token);
      localStorage.setItem("refresh_token", refreshToken); 
      localStorage.setItem("auth_user", JSON.stringify(user));

      router.push("/dashboard");
    } catch (error) {
      setToken(null);
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { user, token, isLoading, login, logout };
}

export function useAuthGuard() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  return { isLoading, isAuthenticated: !!user };
}
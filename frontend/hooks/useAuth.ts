"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export interface User {
  id: string;
  email: string;
  role: "member" | "librarian";
}

export function useAuth() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(
    async (email: string, password: string, role: "member" | "librarian") => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.auth.login({ email, password, role });
        localStorage.setItem("token", response.token);
        setUser(response.user as User);
        return response.user;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Login failed";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/");
  }, [router]);

  const register = useCallback(
    async (data: {
      first_name: string;
      middle_name?: string;
      last_name: string;
      year: number;
      department: string;
      phone: string;
      email: string;
      address: string;
      password: string;
    }) => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.auth.register(data);
        return response;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Registration failed";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    user,
    loading,
    error,
    login,
    logout,
    register,
    isAuthenticated: !!user,
  };
}

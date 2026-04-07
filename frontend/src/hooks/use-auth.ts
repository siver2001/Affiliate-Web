import { useEffect, useState } from "react";

import { clearStoredAuth, getStoredToken, getStoredUser, setStoredAuth } from "../lib/auth-storage";
import type { AuthUser } from "../types/entities";

export function useAuth() {
  const [token, setToken] = useState<string | null>(() => getStoredToken());
  const [user, setUser] = useState<AuthUser | null>(() => getStoredUser());

  useEffect(() => {
    const onStorage = () => {
      setToken(getStoredToken());
      setUser(getStoredUser());
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return {
    token,
    user,
    isAuthenticated: Boolean(token),
    login(nextToken: string, nextUser: AuthUser) {
      setStoredAuth(nextToken, nextUser);
      setToken(nextToken);
      setUser(nextUser);
    },
    logout() {
      clearStoredAuth();
      setToken(null);
      setUser(null);
    }
  };
}

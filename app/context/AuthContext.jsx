"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { clearAuth, getAuth, setAuth } from "../utils/storage";

const AuthContext = createContext({
  user: null,
  isLoading: true,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setUser(getAuth());
    setIsLoading(false);
  }, []);

  const login = useCallback((payload) => {
    setAuth(payload.token, payload.role, payload.userId, payload.email);
    setUser(payload);
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      login,
      logout,
    }),
    [user, isLoading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  return useContext(AuthContext);
};

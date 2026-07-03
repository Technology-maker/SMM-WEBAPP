import { createContext, useEffect, useMemo } from "react";
import { useQuery } from "react-query";
import { getMe, logoutUser } from "../api/authAPI";
import useAuthStore from "../store/authStore";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { user, isAuthenticated, bootstrapped, setUser, clearUser, setBootstrapped } = useAuthStore();

  const meQuery = useQuery("auth:me", getMe, {
    retry: false,
    onSuccess: (response) => setUser(response.data.user),
    onError: () => setBootstrapped()
  });

  useEffect(() => {
    const handler = () => clearUser();
    window.addEventListener("auth:logout", handler);
    return () => window.removeEventListener("auth:logout", handler);
  }, [clearUser]);

  const logout = async () => {
    try {
      await logoutUser();
    } finally {
      clearUser();
    }
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      isLoading: meQuery.isLoading && !bootstrapped,
      setUser,
      logout
    }),
    [user, isAuthenticated, meQuery.isLoading, bootstrapped, setUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

import { createContext, useEffect, useState, useCallback } from "react";
import api from "@/api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = useCallback(async () => {
    try {
      const res = await api.get("/user/me");

      setUser(res.data.user);
    } catch(error) {
      console.error("Error fetching current user:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initializeUser = async () => {
      await fetchCurrentUser();
    };

    initializeUser();
  }, [fetchCurrentUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        fetchCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export default AuthContext;


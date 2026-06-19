import { useContext } from "react";
import AuthContext from "../context/AuthContext"; // Path apne folder ke hisab se check kar lein

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
};
import { createContext, useContext, useEffect, useState } from "react";
import { fetchUserProfile } from "../api/authApi";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile when token exists
  useEffect(() => {
    const loadUserProfile = async () => {
      if (token) {
        try {
          const response = await fetchUserProfile();
          setUserData(response.data);
          setUser({ token });
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
          // If token is invalid, clear it
          if (error.response?.status === 401) {
            localStorage.removeItem("token");
            setToken(null);
            setUser(null);
            setUserData(null);
          }
        }
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    };

    loadUserProfile();
  }, [token]);

  // Login function
  const login = async (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);

    // Fetch user profile immediately after login
    try {
      const response = await fetchUserProfile();
      setUserData(response.data);
    } catch (error) {
      console.error("Failed to fetch user profile after login:", error);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setUserData(null);
  };

  const value = {
    user,
    userData,
    token,
    login,
    logout,
    loading,
    authenticated: !!token,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

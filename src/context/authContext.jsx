import { createContext, useContext, useEffect, useState } from "react";
import { fetchUserProfile } from "../api/authApi";

const AuthContext = createContext();

const TOKEN_EXPIRY_TIME = 12 * 60 * 60 * 1000; // 12 hours in milliseconds

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  // Check token expiry
  const checkTokenExpiry = () => {
    const loginTime = localStorage.getItem("loginTime");

    if (loginTime) {
      const currentTime = Date.now();
      const timeDiff = currentTime - parseInt(loginTime);

      if (timeDiff > TOKEN_EXPIRY_TIME) {
        // Token expired
        logout();
        return false;
      }
    }

    return true;
  };

  // Fetch user profile when token exists
  useEffect(() => {
    const loadUserProfile = async () => {
      if (token && checkTokenExpiry()) {
        try {
          const response = await fetchUserProfile();
          setUserData(response.data);
          setUser({ token });
        } catch (error) {
          console.error("Failed to fetch user profile:", error);

          if (error.response?.status === 401) {
            logout();
          }
        }
      } else {
        logout();
      }

      setLoading(false);
    };

    loadUserProfile();
  }, [token]);

  // Login function
  const login = async (newToken) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("loginTime", Date.now()); // save login time

    setToken(newToken);

    try {
      const response = await fetchUserProfile();
      setUserData(response.data);
      setUser({ token: newToken });
    } catch (error) {
      console.error("Failed to fetch user profile after login:", error);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("loginTime");

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
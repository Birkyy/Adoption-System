import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null); // Add token state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check storage on load
    const storedUser =
      localStorage.getItem("user") || sessionStorage.getItem("user");
    const storedToken =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  const login = (userData, authToken, rememberMe) => {
    // 1. Update State
    setUser(userData);
    setToken(authToken);

    // 2. Update Storage
    if (rememberMe) {
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", authToken);
    } else {
      sessionStorage.setItem("user", JSON.stringify(userData));
      sessionStorage.setItem("token", authToken);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem("user");
    localStorage.removeItem("token");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
  };

  // 3. Helper to get the current token (useful for non-React files)
  const getAccessToken = () => {
    return (
      token || localStorage.getItem("token") || sessionStorage.getItem("token")
    );
  };

  const value = {
    user,
    token,
    login,
    logout,
    loading,
    getAccessToken, // Export this for use in API files
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

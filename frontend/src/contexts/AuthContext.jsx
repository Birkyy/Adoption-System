import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check both storages on initial load
    const storedUser =
      localStorage.getItem("user") || sessionStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData, rememberMe) => {
    // 1. Update State
    setUser(userData);

    // 2. Update Storage
    if (rememberMe) {
      localStorage.setItem("user", JSON.stringify(userData));
    } else {
      sessionStorage.setItem("user", JSON.stringify(userData));
    }
  };

  const logout = () => {
    // 1. Clear State
    setUser(null);

    // 2. Clear Storage
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
  };

  const value = {
    user,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

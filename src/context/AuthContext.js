import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext({
  isAuthenticated: false,
  login: (email, password) => {},
  logout: () => {},
});

function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);

  async function login(email, password) {
    console.log(email, password);
    setIsAuthenticated(true);
    setRefreshToken("test");
    setToken("test");
  }
  async function logout() {
    console.warn("logout");
    window.sessionStorage.removeItem("refreshToken");
    setRefreshToken(null);
    setToken(null);
    setIsAuthenticated(false);
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
const useAuthentification = () => useContext(AuthContext);

export { AuthProvider, useAuthentification };

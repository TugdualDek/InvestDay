import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";

const AuthContext = createContext({
  isAuthenticated: null,
  login: (email, password) => {},
  logout: () => {},
});

function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const router = useRouter();

  async function login(email, password) {
    console.log(email, password);
    setIsAuthenticated(true);
    setRefreshToken("test");
    setToken("test");
    router.push("/");
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

const ProtectRoute = ({ children }) => {
  const { isAuthenticated } = useAuthentification();
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    console.log(isAuthenticated, router.asPath);
    if (!isAuthenticated && router.asPath !== "/login") {
      router.push("/login");
    } else {
      setIsLoaded(true);
    }
  });

  return isLoaded ? children : "Loading...";
};
const useAuthentification = () => useContext(AuthContext);

export { AuthProvider, useAuthentification, ProtectRoute };

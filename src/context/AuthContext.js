import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";

const AuthContext = createContext({
  isAuthenticated: null,
  login: (fetch, email, password) => {},
  register: (fetch, email, password) => {},
  logout: () => {},
  user: {},
});

function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [user, setUser] = useState(null);
  const router = useRouter();

  async function login(fetch, email, password) {
    let result = await fetch.post("/api/auth/login", { email, password });
    console.log(result);
    if (result?.email) {
      setIsAuthenticated(true);
      setUser(result);
      router.push("/");
    }
  }

  async function register(fetch, email, password) {
    let result = await fetch.post("/api/auth/register", { email, password });
    console.log(result);
    if (result?.status) {
      login(fetch, email, password);
    }
  }

  async function logout() {
    console.warn("logout");
    window.sessionStorage.removeItem("refreshToken");
    setIsAuthenticated(false);
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        register,
        logout,
        user,
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

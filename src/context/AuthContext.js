import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";

const AuthContext = createContext({
  isAuthenticated: null,
  login: (fetch, email, password) => {},
  logout: () => {},
  user: {},
  reLogin: () => false,
});

function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    reLogin();
  }, []);

  async function reLogin() {
    try {
      const lastUser = JSON.parse(window.sessionStorage.getItem("lastUser"));
      console.log("Test storage", lastUser);
      if (lastUser.token) {
        console.log("logging in with last user");
        setUser(lastUser);
        setIsAuthenticated(true);
        router.push(router.asPath);
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  }
  async function login(fetch, email, password) {
    let result = await fetch.post("/api/auth/login", { email, password });
    if (result?.email) {
      setIsAuthenticated(true);
      setUser(result);
      console.log("logged in", result);
      window.sessionStorage.setItem("lastUser", JSON.stringify(result));
      router.push("/");
    }
  }

  async function logout() {
    console.warn("logout");
    window.sessionStorage.removeItem("lastUser");

    setIsAuthenticated(false);
    router.push("/login");
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        user,
        reLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

const ProtectRoute = ({ children }) => {
  const { isAuthenticated, reLogin } = useAuthentification();
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    console.log(isAuthenticated, router.asPath);
    if (!isAuthenticated && router.asPath !== "/login" && !reLogin()) {
      router.push("/login");
    } else {
      setIsLoaded(true);
    }
  }, [isAuthenticated, router.asPath]);

  return isLoaded ? children : "Loading...";
};
const useAuthentification = () => useContext(AuthContext);

export { AuthProvider, useAuthentification, ProtectRoute };

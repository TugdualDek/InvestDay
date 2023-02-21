import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";

const AuthContext = createContext({
  isAuthenticated: null,
  login: (fetch, email, password, callback) => {},
  register: (fetch, email, password, name, callback) => {},
  logout: () => {},
  user: null,
  reLogin: () => false,
});

function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [user, setUser] = useState(null);
  const router = useRouter();

  function reLogin() {
    try {
      const lastUser = JSON.parse(window.sessionStorage.getItem("lastUser"));

      if (lastUser?.token) {
        setUser(lastUser);
        setIsAuthenticated(true);
        return true;
      } else {
        return false;
      }
    } catch (e) {
      console.error(e);
    }
  }
  async function login(fetch, email, password, callback) {
    try {
      let result = await fetch.post("/api/auth/login", { email, password });

      if (result?.email) {
        setIsAuthenticated(true);
        setUser(result);
        window.sessionStorage.setItem("lastUser", JSON.stringify(result));
        router.push("/");
      }
    } catch (e) {
      callback(e);
    }
  }

  async function register(fetch, email, password, name) {
    let result = await fetch.post("/api/auth/register", {
      email,
      password,
      name,
    });
    if (result?.status) {
      login(fetch, email, password);
    }
    return result;
  }

  async function logout() {
    console.warn("logout");
    window.sessionStorage.removeItem("lastUser");

    setIsAuthenticated(false);
    router.push("/login");
  }
  useEffect(() => {
    reLogin();
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        register,
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
    if (!isAuthenticated && router.asPath !== "/login" && router.asPath.includes("reset") && !reLogin()) {
      router.push("/login");
    } else {
      setIsLoaded(true);
    }
  }, [isAuthenticated, router.asPath]);

  return isLoaded ? children : "Loading...";
};
const useAuthentification = () => useContext(AuthContext);

export { AuthProvider, useAuthentification, ProtectRoute };

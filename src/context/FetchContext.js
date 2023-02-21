import React, { createContext, useContext } from "react";
import { useAuthentification } from "./AuthContext";
const FetchContext = createContext({
  get: (url, image) => new Promise((resolve) => resolve({})),
  post: (url, body) => new Promise((resolve) => resolve({})),
  put: (url, body) => new Promise((resolve) => resolve({})),
  delete: (url) => new Promise((resolve) => resolve({})),
});

function FetchProvider({ children }) {
  const { isAuthenticated, user, logout } = useAuthentification();

  async function get(url, image = false) {
    const requestOptions = {
      method: "GET",
      headers: authHeader(url),
    };
    const response = await fetch(url, requestOptions);
    if (image) {
      return await response.text();
    }
    return handleResponse(response);
  }

  async function post(url, body, reset = false) {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeader(url) },
      credentials: "include",
      body: JSON.stringify(body),
    };
    const response = await fetch(url, requestOptions);
    return handleResponse(response);
  }

  async function put(url, body) {
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...authHeader(url) },
      body: JSON.stringify(body),
    };
    const response = await fetch(url, requestOptions);
    return handleResponse(response);
  }

  // prefixed with underscored because delete is a reserved word in javascript
  async function _delete(url) {
    const requestOptions = {
      method: "DELETE",
      headers: authHeader(url),
    };
    const response = await fetch(url, requestOptions);
    return handleResponse(response);
  }
  function authHeader(url) {
    // return auth header with jwt if user is logged in and request is to the api url
    const isLoggedIn = user && user.token;
    const isApiUrl = url.startsWith(process.env.API_URL || "");
    if (isLoggedIn && isApiUrl) {
      return { Authorization: `Bearer ${user.token}` };
    } else {
      logout();
      return {};
    }
  }

  function handleResponse(response) {
    return response.text().then((text) => {
      const data = text && JSON.parse(text);

      if (!response.ok) {
        if ([401, 403].includes(response.status) && user) {
          // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
          logout();
        }

        const error = (data && data.message) || response.statusText;
        return Promise.reject(error);
      }

      return data;
    });
  }

  return (
    <FetchContext.Provider value={{ get, post, delete: _delete, put }}>
      {children}
    </FetchContext.Provider>
  );
}

const useFetch = () => useContext(FetchContext);
export { FetchProvider, useFetch };

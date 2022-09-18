import React, { useEffect } from "react";
import { Route, BrowserRouter, Routes, Navigate } from "react-router-dom";
import { useAuthentification } from "../context/AuthContext";
function Logout(props) {
  const { logout } = useAuthentification();
  useEffect(() => {
    logout();
  }, []);
  return <div></div>;
}

export default Logout;

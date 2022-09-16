import React, { useState } from "react";
import "../style/navbar.css";
import { NavLink } from "react-router-dom";

function Navbar() {
  const [l1, setL1] = useState(true);
  const [l2, setL2] = useState(false);
  const [l3, setL3] = useState(false);
  const [l4, setL4] = useState(false);
  const [l5, setL5] = useState(false);

  function handleToggle(l1, l2, l3, l4, l5) {
    setL1(l1);
    setL2(l2);
    setL3(l3);
    setL4(l4);
    setL5(l5);
  }

  return (
    <div className="navigationContainer">
      <div className="navigation">
        <ul>
          <li className={`list ${l1 ? "active" : ""}`}>
            <NavLink
              className="a"
              to="/"
              onClick={() => {
                handleToggle(true, false, false, false, false);
              }}
            >
              <span className="text">Accueil</span>
              <span className="icon">
                <ion-icon name="home-outline"></ion-icon>
              </span>
              <div className={`indicator ${l1 ? "active" : ""}`}></div>
            </NavLink>
          </li>
          <li className={`list ${l2 ? "active" : ""}`}>
            <NavLink
              className="a"
              to="/dashboard"
              onClick={() => {
                handleToggle(false, true, false, false, false);
              }}
            >
              <span className="text">Dashboard</span>
              <span className="icon">
                <ion-icon name="apps-outline"></ion-icon>
              </span>
              <div className={`indicator ${l2 ? "active" : ""}`}></div>
            </NavLink>
          </li>
          <li className={`list ${l3 ? "active" : ""}`}>
            <NavLink
              className="a"
              to="/search"
              onClick={() => {
                handleToggle(false, false, true, false, false);
              }}
            >
              <span className="text">Rechercher</span>
              <span className="icon">
                <ion-icon name="search-outline"></ion-icon>
              </span>
              <div className={`indicator ${l3 ? "active" : ""}`}></div>
            </NavLink>
          </li>
          <li className={`list ${l4 ? "active" : ""}`}>
            <NavLink
              className="a"
              to="/stats"
              onClick={() => {
                handleToggle(false, false, false, true, false);
              }}
            >
              <span className="text">Statistiques</span>
              <span className="icon">
                <ion-icon name="stats-chart-outline"></ion-icon>
              </span>
              <div className={`indicator ${l4 ? "active" : ""}`}></div>
            </NavLink>
          </li>
          <li className={`list ${l5 ? "active" : ""}`}>
            <NavLink
              className="a"
              to="/login"
              onClick={() => {
                handleToggle(false, false, false, false, true);
              }}
            >
              <span className="text">Login</span>
              <span className="icon">
                <ion-icon name="log-in-outline"></ion-icon>
              </span>
              <div className={`indicator ${l5 ? "active" : ""}`}></div>
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Navbar;

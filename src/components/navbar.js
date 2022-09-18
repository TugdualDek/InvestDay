import React, { useState } from "react";
import "../style/navbar.css";
import NavTab from "./navTab";
function Navbar() {
  const [active, setActive] = useState("l1");


  function handleToggle(state) {
    setActive(state);
  }

  return (
    <div className="navigationContainer">
      <div className="navigation">
        <ul>
          <NavTab handleToggle={handleToggle} active={active} id="l1" title="Accueil" icon="home-outline" to="/" />
          <NavTab handleToggle={handleToggle} active={active} id="l2" title="Dashboard" icon="apps-outline" to="/dashboard" />
          <NavTab handleToggle={handleToggle} active={active} id="l3" title="Rechercher" icon="search-outline" to="/search" />
          <NavTab handleToggle={handleToggle} active={active} id="l4" title="Statistiques" icon="stats-chart-outline" to="/stats" />
          <NavTab handleToggle={handleToggle} active={active} id="l5" title="Login" icon="log-in-outline" to="/login" />

        </ul>
      </div>
    </div>
  );
}


export default Navbar;

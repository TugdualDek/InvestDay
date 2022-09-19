import React, { useState } from "react";
import "../style/navbar.css";
import NavTab from "./navTab";
function Navbar() {
  const [active, setActive] = useState("l1");
  function handleToggle(state) {
    setActive(state);
  }
  return (
    <div className="navBarContainer">
      <div>Logo</div>
      <ul className="navButtonContainer">
        <NavTab
          handleToggle={handleToggle}
          active={active}
          id="accueil"
          title="Accueil"
          to="/"
        />
        <NavTab
          handleToggle={handleToggle}
          active={active}
          id="wallet"
          title="Portefeuille"
          to="/wallet"
        />
        <NavTab
          handleToggle={handleToggle}
          active={active}
          id="market"
          title="Marchés"
          to="/market"
        />
        <NavTab
          handleToggle={handleToggle}
          active={active}
          id="ranking"
          title="Classement"
          to="/ranks"
        />
        <NavTab
          handleToggle={handleToggle}
          active={active}
          id="logout"
          title="Déconnexion"
          to="/logout"
        />
      </ul>
    </div>
  );
}

export default Navbar;

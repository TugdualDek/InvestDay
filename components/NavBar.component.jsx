import React, { useState } from "react";
import navBarStyles from "../styles/NavBar.module.css";
import NavTab from "./NavTab.component";
function Navbar() {
  const [active, setActive] = useState("l1");
  function handleToggle(state) {
    setActive(state);
  }
  return (
    <div className={navBarStyles.navBarContainer}>
      <div>Logo</div>
      <ul className={navBarStyles.navButtonContainer}>
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

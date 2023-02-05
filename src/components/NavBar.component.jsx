import React, { useState } from "react";
import navBarStyles from "../styles/NavBar.module.css";
import NavTab from "./NavTab.component";
import logo from "src/public/assets/logo.webp";
import Image from "next/image";
import Link from "next/link";

function Navbar() {
  const [active, setActive] = useState("l1");
  function handleToggle(state) {
    setActive(state);
  }

  const [menu, setMenu] = useState(false);
  function toggleMenu() {
    setMenu((prevState) => !prevState);
  }

  return (
    <div className={navBarStyles.navBarContainer}>
      <div className={navBarStyles.logoContainer}>
        <Link id="logo-click" href={"/"}>
          <Image src={logo} width={100} alt="logo" />
        </Link>
      </div>
      <ul
        className={`${navBarStyles.navButtonContainer} ${
          menu ? navBarStyles.isActived : ""
        }`}
        onClick={toggleMenu}
      >
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
      <div
        className={`${navBarStyles.menu} ${menu ? navBarStyles.change : ""}`}
        onClick={toggleMenu}
      >
        <div className={navBarStyles.menuLine1}></div>
        <div className={navBarStyles.menuLine2}></div>
        <div className={navBarStyles.menuLine3}></div>
      </div>
    </div>
  );
}

export default Navbar;

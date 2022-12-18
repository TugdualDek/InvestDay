import React from "react";
import Link from "next/link";
import navButtonStyles from "../styles/NavButton.module.css";
import navBarStyles from "../styles/NavButton.module.css";

function NavTab({ active, id, title, icon, to, handleToggle }) {
  return (
    <li
      className={[
        navButtonStyles.list,
        active === id ? navButtonStyles.active : null,
      ]}
    >
      {/* <NavLink
        className="a"
        to={to}
        onClick={() => {
          handleToggle(id);
        }}
      > */}
      <Link
        className={navBarStyles.navButtonContainer}
        href={to}
        onClick={() => {
          handleToggle(id);
        }}
      >
        <span>{title}</span>
        <span></span>
        <div className={active === id ? navButtonStyles.active : null}></div>
      </Link>
      {/* </NavLink> */}
    </li>
  );
}

export default NavTab;

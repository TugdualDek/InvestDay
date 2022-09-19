import React from "react";
import { NavLink } from "react-router-dom";

function NavTab({ active, id, title, icon, to, handleToggle }) {
  return (
    <li className={`list ${active === id ? "active" : ""}`}>
      <NavLink
        className="a"
        to={to}
        onClick={() => {
          handleToggle(id);
        }}
      >
        <span className="text">{title}</span>
        <span className="icon"></span>
        <div className={`indicator ${active === id ? "active" : ""}`}></div>
      </NavLink>
    </li>
  );
}

export default NavTab;

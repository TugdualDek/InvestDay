import React from "react";
import Link from "next/link";
import navBarStyles from "../styles/NavButton.module.css";

import navButtonStyles from "../styles/NavButton.module.css";
import { useRouter } from "next/router";

function NavTab({ active, id, title, icon, to, handleToggle }) {
  const router = useRouter();
  console.log(router.asPath, to, router.asPath === to);
  return (
    <li
      className={[
        navButtonStyles.list,
        router.asPath === to ? navButtonStyles.active : null,
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
        <span className={router.asPath === to ? navButtonStyles.active : null}>
          {title}
        </span>
        <span></span>
        <div
          className={router.asPath === to ? navButtonStyles.active : null}
        ></div>
      </Link>
      {/* </NavLink> */}
    </li>
  );
}

export default NavTab;

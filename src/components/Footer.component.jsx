import React from "react";
import footerStyles from "../styles/Footer.module.css";
import Partners from "./Partners.component";

export default function Footer() {
  return (
    <div className={footerStyles.container}>
      <Partners />
      <span>IsepInvest - v1.0</span>
    </div>
  );
}

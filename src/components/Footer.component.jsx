import React from "react";
import footerStyles from "../styles/Footer.module.css";
import Partners from "./Partners.component";

export default function Footer() {
  return (
    <div className={footerStyles.container}>
      <Partners />
      <span>
        Rejoindre{" "}
        <a
          href="https://discord.gg/smw2CSHvCW"
          target="_blank"
          rel="noreferrer"
        >
          notre discord
        </a>{" "}
      </span>
      <span>IsepInvest - v1.2</span>
    </div>
  );
}

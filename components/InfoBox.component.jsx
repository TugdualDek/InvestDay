import React from "react";
import InfoBoxStyles from "../styles/InfoBox.module.css";
function InfoBox({ title, desc, icon }) {
  return (
    <div className={InfoBoxStyles.infoBox}>
      <div className={InfoBoxStyles.infoBoxIcon}>
        <ion-icon name={icon}></ion-icon>
      </div>
      <div className={InfoBoxStyles.infoBoxContent}>
        <div className={InfoBoxStyles.infoBoxTitle}>{title}</div>
        <div className={InfoBoxStyles.infoBoxDesc}>{desc}</div>
      </div>
    </div>
  );
}

export default InfoBox;

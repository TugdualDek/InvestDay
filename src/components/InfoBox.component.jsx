import React from "react";
import InfoBoxStyles from "../styles/InfoBox.module.css";
import Image from "next/image";
function InfoBox({ title, desc, icon }) {
  return (
    <div className={InfoBoxStyles.infoBox}>
      <div className={InfoBoxStyles.infoBoxIcon}>
        <Image src={icon} alt={icon}></Image>
      </div>
      <div className={InfoBoxStyles.infoBoxContent}>
        <div className={InfoBoxStyles.infoBoxTitle}>{title}</div>
        <div className={InfoBoxStyles.infoBoxDesc}>{desc}</div>
      </div>
    </div>
  );
}

export default InfoBox;

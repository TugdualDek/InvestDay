import React from "react";
import "../style/infoBox.css";
function InfoBox({ title, desc, icon }) {
  return (
    <div className={"infoBox"}>
      <div className={"infoBoxIcon"}>
        <ion-icon name={icon}></ion-icon>
      </div>
      <div className={"infoBoxContent"}>
        <div className={"infoBoxTitle"}>{title}</div>
        <div className={"infoBoxDesc"}>{desc}</div>
      </div>
    </div>
  );
}

export default InfoBox;

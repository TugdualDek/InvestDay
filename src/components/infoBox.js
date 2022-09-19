import React from "react";

function InfoBox({ title, desc, icon }) {
  return (
    <div className={"infoBoxContainer"}>
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

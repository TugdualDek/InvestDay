import React from "react";
import "../style/home.css";
import InfoBox from "../components/infoBox";
import Button from "../components/button";
import TableTransaction from "../components/tableTransaction";
function Home(props) {
  return (
    <div className={"pageContainer"}>
      <div className={"headerContainer"}>
        <h1>Tableau de bord</h1>
        <Button title={"Chercher une action"} onClick={() => {}} />
      </div>
      <div className={"contentContainer"}>
        <div className={"infoBoxContainer"}>
          <InfoBox title={"Votre portefeuille"} desc={"$1000"} icon={"home"} />
          <InfoBox title={"Cash"} desc={"$1000"} icon={"home"} />
          <InfoBox title={"Total"} desc={"$2000"} icon={"home"} />
        </div>
        <div className={"tableContainer"}>
          <TableTransaction />
        </div>
      </div>
    </div>
  );
}

export default Home;

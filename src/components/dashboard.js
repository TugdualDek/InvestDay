import React from "react";
import PorteValues from "./dashboard/porteValues.js";
import PositionVal from "./dashboard/positionVal.js";
import "../style/dashboard.css";

function Dashboard() {
  return (
    <div className="dashContainer">
      <h1>Dashboard</h1>
      <p>Merci de vous connecter afin d'avoir accès à votre dashboard !</p>
      <br />
      <div className="portefeuille">
        <h3>Votre portefeuille :</h3>
        <PorteValues title="Argent disponible :" value="5000€" />
        <PorteValues title="Argent total :" value="5250€" />
        <PorteValues title="Nombre de positions :" value="2" />
      </div>
      <br />
      <div className="positions">
        <PositionVal />
      </div>
    </div>
  );
}

export default Dashboard;

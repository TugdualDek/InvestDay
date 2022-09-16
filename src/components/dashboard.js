import React from "react";
import Cash from "./dashboard/cash.js";
import Positions from "./dashboard/positions.js";
import "../style/dashboard.css";

function Dashboard() {
  return (
    <div className="dashContainer">
      <h1>Dashboard</h1>
      <p>Merci de vous connecter afin d'avoir accès à votre dashboard !</p>
      <div class="grid-container">
        <div id="cash">
          <h3>Votre cash :</h3>
          <Cash value="500" />
        </div>
        <div id="portefeuille">
          <h3>Votre portefeuille :</h3>
          <Cash value="500" />
        </div>
        <div id="actions">
          <h3>Vos actions :</h3>
          <Positions />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

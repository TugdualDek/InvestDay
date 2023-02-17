import React from "react";
import "../../style/table.css";

function Positions(props) {
  const transactions = [
    {
      name: "Air France",
      number: 2,
      value: "125",
    },
    {
      name: "Air Liquide",
      number: 1,
      value: "150",
    },
    {
      name: "Société générale",
      number: 10,
      value: "500",
    },
    {
      name: "Société générale",
      number: 10,
      value: "500",
    },
    {
      name: "Société générale",
      number: 10,
      value: "500",
    },
  ];

  return (
    <div className="positionContainer">
      <table>
        <caption>Positions ouvertes :</caption>
        <thead>
          <tr>
            <th scope="col">Nom</th>
            <th scope="col">Nombre</th>
            <th scope="col">Valeur</th>
            <th scope="col"></th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transactions) => {
            return (
              <tr key={transactions.id}>
                <td data-label="Nom" class="name-ac">
                  {transactions.name}
                </td>
                <td data-label="Nombre">{transactions.number}</td>
                <td data-label="Valeur">{transactions.value}€</td>
                <td data-label="">
                  <button>Acheter</button>
                </td>
                <td data-label="">
                  <button>Vendre</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default Positions;

import React from "react";
import TableTransactionStyles from "../styles/TableTransaction.module.css";
import Button from "./Button.component.jsx";
function TableSearch(props) {
  const data = [
    {
      libelle: "BTC",
      nom: "Bitcoin",
      valActuelle: 200,
    },
    {
      libelle: "EDF",
      nom: "E.D.F.",
      valActuelle: 300,
    },
  ];
  return (
    <table className={TableTransactionStyles.transactionTable}>
      <thead>
        <tr>
          <th>Libellé</th>
          <th>Nom</th>
          <th>Valeur actuelle</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            <td>{item?.libelle}</td>
            <td>{item?.nom}</td>
            <td>{item?.valActuelle}</td>
            <td>
              <Button
                title={"Voir"}
                onClick={() => {
                  router.push("/market");
                }}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TableSearch;

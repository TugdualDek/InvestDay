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
        <tr className={TableTransactionStyles.tr}>
          <th className={TableTransactionStyles.th}>Libellé</th>
          <th className={TableTransactionStyles.th}>Nom</th>
          <th className={TableTransactionStyles.th}>Valeur actuelle</th>
          <th className={TableTransactionStyles.th}>Action</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index} className={TableTransactionStyles.tr}>
            <td data-label="Libellé" className={TableTransactionStyles.td}>
              {item?.libelle}
            </td>
            <td data-label="Nom" className={TableTransactionStyles.td}>
              {item?.nom}
            </td>
            <td
              data-label="Valeur Actuelle"
              className={TableTransactionStyles.td}
            >
              {item?.valActuelle}
            </td>
            <td data-label="Action" className={TableTransactionStyles.td}>
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

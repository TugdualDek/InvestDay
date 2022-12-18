import React from "react";
import TableTransactionStyles from "../styles/TableTransaction.module.css";
function TableWallet(props) {
  const data = [
    {
      libelle: "Bitcoin",
      quantite: "0.01",
      valeurAchat: 200,
      valeurActuelle: 300,
      varPrice: 100,
      varPercentage: 10,
    },
    {
      libelle: "EDF",
      quantite: "1",
      valeurAchat: 200,
      valeurActuelle: 300,
      varPrice: 100,
      varPercentage: 10,
    },
  ];
  return (
    <table className={TableTransactionStyles.transactionTable}>
      <thead>
        <tr>
          <th>Libellé</th>
          <th>Quantité</th>
          <th>Valeur achat</th>
          <th>Valeur actuelle</th>
          <th>Var $</th>
          <th>Var %</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            <td>{item?.libelle}</td>
            <td>{item?.quantite}</td>
            <td>{item?.valeurAchat}</td>
            <td>{item?.valeurActuelle}</td>
            <td>{item?.varPrice}</td>
            <td>{item?.varPercentage}</td>
            <td>
              <a>Vendre</a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TableWallet;

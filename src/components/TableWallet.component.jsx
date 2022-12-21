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
        <tr className={TableTransactionStyles.tr}>
          <th className={TableTransactionStyles.th}>Libellé</th>
          <th className={TableTransactionStyles.th}>Quantité</th>
          <th className={TableTransactionStyles.th}>Valeur achat</th>
          <th className={TableTransactionStyles.th}>Valeur actuelle</th>
          <th className={TableTransactionStyles.th}>Var $</th>
          <th className={TableTransactionStyles.th}>Var %</th>
          <th className={TableTransactionStyles.th}>Action</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index} className={TableTransactionStyles.tr}>
            <td data-label="Libellé" className={TableTransactionStyles.td}>
              {item?.libelle}
            </td>
            <td data-label="Quantité" className={TableTransactionStyles.td}>
              {item?.quantite}
            </td>
            <td data-label="Val Achat" className={TableTransactionStyles.td}>
              {item?.valeurAchat}
            </td>
            <td data-label="Val Actuelle" className={TableTransactionStyles.td}>
              {item?.valeurActuelle}
            </td>
            <td data-label="Var $" className={TableTransactionStyles.td}>
              {item?.varPrice}
            </td>
            <td data-label="Var %" className={TableTransactionStyles.td}>
              {item?.varPercentage}
            </td>
            <td data-label="Action" className={TableTransactionStyles.td}>
              <a>Vendre</a>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TableWallet;

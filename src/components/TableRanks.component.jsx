import React from "react";
import TableTransactionStyles from "../styles/TableTransaction.module.css";
function TableRanks(props) {
  const data = [
    {
      nom: "Pepnieau",
      prenom: "Charles",
      valWallet: 600,
    },
    {
      prenom: "John",
      nom: "Doe",
      valWallet: 400,
    },
    {
      prenom: "Benoit",
      nom: "Thomas",
      valWallet: 200,
    },
    {
      prenom: "Tugdual",
      nom: "de Kerdrel",
      valWallet: 100,
    },
  ];
  return (
    <table className={TableTransactionStyles.transactionTable}>
      <thead>
        <tr className={TableTransactionStyles.tr}>
          <th className={TableTransactionStyles.th}>Rang</th>
          <th className={TableTransactionStyles.th}>Prenom</th>
          <th className={TableTransactionStyles.th}>Nom</th>
          <th className={TableTransactionStyles.th}>Valeur portefeuille</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr
            key={index}
            className={[
              TableTransactionStyles.tr,
              TableTransactionStyles.ranks,
            ].join(" ")}
          >
            <td data-label="Rang" className={TableTransactionStyles.td}>
              {index + 1}
            </td>
            <td data-label="Prenom" className={TableTransactionStyles.td}>
              {item?.prenom}
            </td>
            <td data-label="Nom" className={TableTransactionStyles.td}>
              {item?.nom}
            </td>
            <td
              data-label="Valeur Portefeuille"
              className={TableTransactionStyles.td}
            >
              {item?.valWallet}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TableRanks;

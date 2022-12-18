import React from "react";
import TableTransactionStyles from "../styles/TableTransaction.module.css";
function TableRanks(props) {
  const data = [
    {
      nom: "Pepnieau",
      prenom: "Charles",
      valWallet: 200,
    },
    {
      prenom: "John",
      nom: "Doe",
      valWallet: 400,
    },
  ];
  return (
    <table className={TableTransactionStyles.transactionTable}>
      <thead>
        <tr>
          <th>Prenom</th>
          <th>Nom</th>
          <th>Valeur portefeuille</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            <td>{item?.prenom}</td>
            <td>{item?.nom}</td>
            <td>{item?.valWallet}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TableRanks;

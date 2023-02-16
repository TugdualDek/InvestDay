import React from "react";
import TableTransactionStyles from "../styles/TableTransaction.module.css";
function TableRanks(props) {
  //iterate through the data and remove the admin
  const data = props.data.filter((item) => item?.user.isAdmin === false);
  return (
    <table className={TableTransactionStyles.transactionTable}>
      <thead>
        <tr className={TableTransactionStyles.tr}>
          <th className={TableTransactionStyles.th}>Rang</th>
          {/* <th className={TableTransactionStyles.th}>Prenom</th> */}
          <th className={TableTransactionStyles.th}>Nom</th>
          <th className={TableTransactionStyles.th}>Valeur portefeuille</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          // check if user is admin or not
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
            {/* <td data-label="Prenom" className={TableTransactionStyles.td}>
              {item?.prenom}
            </td> */}
            <td data-label="Nom" className={TableTransactionStyles.td}>
              {item?.user.name ? item?.user.name : item?.user.email}
            </td>
            <td
              data-label="Valeur Portefeuille"
              className={TableTransactionStyles.td}
            >
              {(item?.publicWalletValue).toFixed(2)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TableRanks;

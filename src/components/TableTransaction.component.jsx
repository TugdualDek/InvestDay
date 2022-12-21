import React from "react";
import TableTransactionStyles from "../styles/TableTransaction.module.css";
function TableTransaction(props) {
  const data = [
    {
      date: "2020-01-01T00:00:00.000Z",
      action: "AAPL",
      type: "Achat",
      price: 90,
      amount: 20,
      status: "PENDING",
    },
    {
      date: "2020-01-01T00:00:00.000Z",
      action: "AAPL",
      type: "Achat",
      price: 100,
      amount: 10,
      status: "SUCCESS",
    },
  ];
  return (
    <table className={TableTransactionStyles.transactionTable}>
      <thead>
        <tr className={TableTransactionStyles.tr}>
          <th scope="col" className={TableTransactionStyles.th}>
            Date de la transaction
          </th>
          <th scope="col" className={TableTransactionStyles.th}>
            Société
          </th>
          <th scope="col" className={TableTransactionStyles.th}>
            Valeur
          </th>
          <th scope="col" className={TableTransactionStyles.th}>
            Montant
          </th>
          <th scope="col" className={TableTransactionStyles.th}>
            Action
          </th>
          <th scope="col" className={TableTransactionStyles.th}>
            Status
          </th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index} className={TableTransactionStyles.tr}>
            <td data-label="Date" className={TableTransactionStyles.td}>
              {item?.date}
            </td>
            <td data-label="Action" className={TableTransactionStyles.td}>
              {item?.action}
            </td>
            <td data-label="Prix" className={TableTransactionStyles.td}>
              {item?.price}
            </td>
            <td data-label="Quantité" className={TableTransactionStyles.td}>
              {item?.amount}
            </td>
            <td data-label="Type" className={TableTransactionStyles.td}>
              {item?.type}
            </td>
            <td data-label="Status" className={TableTransactionStyles.td}>
              {item?.status}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TableTransaction;

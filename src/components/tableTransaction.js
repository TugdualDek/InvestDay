import React from "react";
import "../style/tableTransaction.css";
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
    <table className={"transactionTable"}>
      <thead>
        <tr>
          <th>Date de la transaction</th>
          <th>Société</th>
          <th>Valeur</th>
          <th>Montant</th>
          <th>Action</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            <td>{item?.date}</td>
            <td>{item?.action}</td>
            <td>{item?.price}</td>
            <td>{item?.amount}</td>
            <td>{item?.type}</td>
            <td>{item?.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default TableTransaction;

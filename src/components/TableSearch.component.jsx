import React from "react";
import TableTransactionStyles from "../styles/TableTransaction.module.css";
import Button from "./Button.component.tsx";

import { useRouter } from "next/router";

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
    {
      libelle: "AAPL",
      nom: "Apple",
      valActuelle: 300,
    },
  ];

  const router = useRouter();

  return (
    <table className={TableTransactionStyles.transactionTable}>
      <thead>
        <tr className={TableTransactionStyles.tr}>
          <th className={TableTransactionStyles.th}>Libellé</th>
          <th className={TableTransactionStyles.th}>Nom</th>
          <th className={TableTransactionStyles.th}>Action</th>
        </tr>
      </thead>
      <tbody>
        {props.data.map((item, index) => (
          <tr key={index} className={TableTransactionStyles.tr}>
            <td data-label="Libellé" className={TableTransactionStyles.td}>
              {item?.symbol}
            </td>
            <td data-label="Nom" className={TableTransactionStyles.td}>
              {item?.name}
            </td>
            <td data-label="Action" className={TableTransactionStyles.td}>
              <Button
                title={"Voir"}
                onClick={() => {
                  router.push("/market/" + item?.symbol);
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

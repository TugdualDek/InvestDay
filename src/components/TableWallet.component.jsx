import React, { useEffect, useState } from "react";
import TableTransactionStyles from "../styles/TableTransaction.module.css";
import { useFetch } from "../context/FetchContext.js";
import { useWallet } from "../context/WalletContext";
function TableWallet({ selectedId, activeWalletTransactions }) {
  const fetch = useFetch();
  const { walletsLines, actualiseWalletsLines, valuesCached } = useWallet();
  useEffect(() => {
    if (!(walletsLines && walletsLines[selectedId])) actualiseWalletsLines();
  }, [activeWalletTransactions]);

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
          <th className={TableTransactionStyles.th}>Gain</th>

          <th className={TableTransactionStyles.th}>Action</th>
        </tr>
      </thead>
      <tbody>
        {walletsLines &&
          walletsLines[selectedId] &&
          walletsLines[selectedId].map((item, index) => {
            let value = valuesCached?.[item.symbol]?.value;
            if (!value.toFixed(2)) return <></>;
            return (
              <tr key={index} className={TableTransactionStyles.tr}>
                <td data-label="Libellé" className={TableTransactionStyles.td}>
                  {item?.symbol}
                </td>
                <td data-label="Quantité" className={TableTransactionStyles.td}>
                  {item?.quantity}
                </td>
                <td
                  data-label="Val Achat"
                  className={TableTransactionStyles.td}
                >
                  {item?.valueAtExecution?.toFixed(2)} $
                </td>
                <td
                  data-label="Val Actuelle"
                  className={TableTransactionStyles.td}
                >
                  {value?.toFixed(2)} $
                </td>

                <td data-label="Var $" className={TableTransactionStyles.td}>
                  {(value - item.valueAtExecution)?.toFixed(2)} $
                </td>
                <td data-label="Var %" className={TableTransactionStyles.td}>
                  {item.valueAtExecution
                    ? (
                        ((value - item.valueAtExecution) /
                          item.valueAtExecution) *
                        100
                      ).toFixed(2)
                    : "-"}{" "}
                  %
                </td>
                <td data-label="Gain" className={TableTransactionStyles.td}>
                  {((value - item.valueAtExecution) * item.quantity).toFixed(2)}{" "}
                  $
                </td>
                <td data-label="Action" className={TableTransactionStyles.td}>
                  <a>Vendre</a>
                </td>
              </tr>
            );
          })}
      </tbody>
    </table>
  );
}

export default TableWallet;

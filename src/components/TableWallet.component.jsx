import React, { useEffect, useState } from "react";
import TableTransactionStyles from "../styles/TableTransaction.module.css";
import { useFetch } from "../context/FetchContext.js";
import { useWallet } from "../context/WalletContext";
import Popup from "./Popup.component";
function TableWallet({ selectedId, activeWalletTransactions }) {
  const fetch = useFetch();
  const { walletsLines, actualiseWalletsLines, valuesCached } = useWallet();
  useEffect(() => {
    if (!(walletsLines && walletsLines[selectedId])) actualiseWalletsLines();
  }, [activeWalletTransactions]);
  function openPopUp() {}

  return (
    <>
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
              if (value == null) return <></>;
              console.log("VALUE", item);
              // averagePriceAtExecution

              let quantityBuy = 0;
              let averagePriceAtExecution = item.valueAtExecution.reduce(
                (acc, item2) => {
                  quantityBuy += item2.quantity;
                  return acc + item2.quantity * item2.price;
                },
                0
              );
              averagePriceAtExecution = averagePriceAtExecution / quantityBuy;
              console.log("av", averagePriceAtExecution);
              return (
                <tr key={index} className={TableTransactionStyles.tr}>
                  <td
                    data-label="Libellé"
                    className={TableTransactionStyles.td}
                  >
                    {item?.symbol}
                  </td>
                  <td
                    data-label="Quantité"
                    className={TableTransactionStyles.td}
                  >
                    {item?.quantity?.toFixed(2)}
                  </td>
                  <td
                    data-label="Val Achat"
                    className={TableTransactionStyles.td}
                  >
                    {averagePriceAtExecution?.toFixed(2)} $
                  </td>
                  <td
                    data-label="Val Actuelle"
                    className={TableTransactionStyles.td}
                  >
                    {value?.toFixed(2)} $
                  </td>

                  <td data-label="Var $" className={TableTransactionStyles.td}>
                    {(value - averagePriceAtExecution)?.toFixed(2)} $
                  </td>
                  <td data-label="Var %" className={TableTransactionStyles.td}>
                    {averagePriceAtExecution
                      ? (
                          ((value - averagePriceAtExecution) /
                            averagePriceAtExecution) *
                          100
                        ).toFixed(2)
                      : "-"}{" "}
                    %
                  </td>
                  <td data-label="Gain" className={TableTransactionStyles.td}>
                    {(
                      (value - averagePriceAtExecution) *
                      item.quantity
                    ).toFixed(2)}{" "}
                    $
                  </td>
                  <td data-label="Action" className={TableTransactionStyles.td}>
                    <Popup
                      title="Vendre"
                      subtitle="Quantité"
                      sell={true}
                      symbol={item.symbol}
                      maxCount={item.quantity}
                    />
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </>
  );
}

export default TableWallet;

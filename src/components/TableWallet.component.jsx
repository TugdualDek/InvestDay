import React, { useEffect, useState } from "react";
import TableTransactionStyles from "../styles/TableTransaction.module.css";
import { useFetch } from "../context/FetchContext.js";

function TableWallet({ activeWalletTransactions }) {
  const fetch = useFetch();

  const [walletlines, setLines] = useState(activeWalletTransactions);
  useEffect(() => {
    console.log("refreshed");
    setLines([]);
    calculateLinesAsync(activeWalletTransactions);
  }, [activeWalletTransactions]);

  async function calculateLinesAsync() {
    let realTablelines = await getRealLines();
    fillLines(realTablelines);
  }
  async function getRealLines() {
    let acc = activeWalletTransactions.reduce((acc, transaction) => {
      const index = acc.findIndex((item) => item.symbol === transaction.symbol);
      if (index === -1) {
        acc.push({
          symbol: transaction.symbol,
          quantity: transaction.quantity,
          valueAtExecution: transaction.valueAtExecution,
        });
      } else {
        acc[index].valueAtExecution += transaction.valueAtExecution;
      }
      return acc;
    }, []);
    return acc;
  }
  async function getPrice(symbol) {
    try {
      const response = await fetch.get("/api/stock/lastPrice?symbol=" + symbol);

      return response;
    } catch (error) {
      console.log("error", error);
    }
  }
  async function fillLines(lines) {
    let values = [];
    lines.forEach((transaction) => {
      getPrice(transaction.symbol).then((price) => {
        let newLine = {
          ...transaction,
          valeurActuelle: price,
          variationDollar: (
            price * transaction.quantity -
            transaction.valueAtExecution
          ).toFixed(2),
          variationPourcentage: (
            ((price * transaction.quantity - transaction.valueAtExecution) /
              transaction.valueAtExecution) *
            100
          ).toFixed(2),
          gain: (
            (price - transaction.valueAtExecution) *
            transaction.quantity
          ).toFixed(2),
        };
        setLines((value) => [...value, newLine]);
      });
    });
  }

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
        {walletlines &&
          walletlines.map((item, index) => (
            <tr key={index} className={TableTransactionStyles.tr}>
              <td data-label="Libellé" className={TableTransactionStyles.td}>
                {item?.symbol}
              </td>
              <td data-label="Quantité" className={TableTransactionStyles.td}>
                {item?.quantity}
              </td>
              <td data-label="Val Achat" className={TableTransactionStyles.td}>
                {item?.valueAtExecution} $
              </td>
              <td
                data-label="Val Actuelle"
                className={TableTransactionStyles.td}
              >
                {item?.valeurActuelle} $
              </td>
              <td data-label="Var $" className={TableTransactionStyles.td}>
                {item?.variationDollar} $
              </td>
              <td data-label="Var %" className={TableTransactionStyles.td}>
                {item?.variationPourcentage} %
              </td>
              <td data-label="Gain" className={TableTransactionStyles.td}>
                {item?.gain} $
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

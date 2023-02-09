import React, { useEffect, useState } from "react";
import TableTransactionStyles from "../styles/TableTransaction.module.css";
import { useFetch } from "../context/FetchContext.js";

function TableWallet(props) {
  const fetch = useFetch();
  const [lastPrice, setLastPrice] = useState(0);
  const [symbol, setSymbol] = useState("");
  const fakeData = [
    {
      libelle: "Bitcoin",
      quantite: "0.01",
      valeurAchat: 200,
      valeurActuelle: 300,
    },
    {
      libelle: "EDF",
      quantite: "1",
      valeurAchat: 200,
      valeurActuelle: 300,
    },
  ];
  const [data, setData] = React.useState(fakeData);

  async function getPrice(symbol) {
    return 100; /* await fetch
      .get("http://localhost:3000/api/stock/lastPrice?symbol=" + symbol)
      .then((response) => {
        return response;
      })
      .catch((error) => {
        console.log(error);
      }); */
  }

  useEffect(() => {
    if (props) {
      // make the sum of valueAtExecution for each symbol
      let transactions = props.activeWalletTransactions.reduce(
        (acc, transaction) => {
          const index = acc.findIndex(
            (item) => item.symbol === transaction.symbol
          );
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
        },
        []
      );

      // get the last price for each symbol
      transactions = transactions.map( (transaction) => {
        console.log("test ", transaction);
        const price = await getPrice(transaction.symbol);
        console.log("price ", price);
        return transactions;
      });
      console.log("transatcions ", transactions)
      const data = transactions.map((transaction) => {
        //read the last price from the prices array that corresponds to the symbol
        return {
          libelle: transaction.symbol,
          quantite: transaction.quantity,
          valeurActuelle:200,
          variationDollar: (
            lastPrice * transaction.quantity -
            transaction.valueAtExecution
          ).toFixed(2),
          variationPourcentage: (
            ((lastPrice * transaction.quantity - transaction.valueAtExecution) /
              transaction.valueAtExecution) *
            100
          ).toFixed(2),
          gain: (
            (lastPrice - transaction.valueAtExecution) *
            transaction.quantity
          ).toFixed(2),
        };
      });

      setData(data);
    }
  }, [props]);

  return (
    <table className={TableTransactionStyles.transactionTable}>
      <thead>
        <tr className={TableTransactionStyles.tr}>
          <th className={TableTransactionStyles.th}>Libellé</th>
          <th className={TableTransactionStyles.th}>Quantité</th>
          {/* <th className={TableTransactionStyles.th}>Valeur achat</th> */}
          <th className={TableTransactionStyles.th}>Valeur actuelle</th>
          <th className={TableTransactionStyles.th}>Var $</th>
          <th className={TableTransactionStyles.th}>Var %</th>
          <th className={TableTransactionStyles.th}>Gain</th>

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
            {/* <td data-label="Val Achat" className={TableTransactionStyles.td}>
              {item?.valeurAchat} $
            </td> */}
            <td data-label="Val Actuelle" className={TableTransactionStyles.td}>
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

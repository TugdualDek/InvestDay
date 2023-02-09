import React, { useEffect } from "react";
import TableTransactionStyles from "../styles/TableTransaction.module.css";
function TableWallet(props) {
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
  useEffect(() => {
    if (props) {
      // make the sum of valueAtExecution for each symbol
      const transactions = props.activeWalletTransactions.reduce((acc, transaction) => {
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
      }, []);
      // make a list of all the transactions of the active wallet by adding the transactions of the same symbols together
      /* const transactions = props.activeWalletTransactions.reduce((acc, transaction) => {
        const index = acc.findIndex(
          (item) => item.symbol === transaction.symbol
        );
        if (index === -1) {
          acc.push({
            symbol: transaction.symbol,
            quantity: transaction.quantity,
            price: transaction.valueAtExecution,
          });
        } else {
          acc[index].quantity += transaction.quantity;
        }
        return acc;
      }, []); */

      console.log(transactions);
      // get the current price of each symbol
      //const symbols = transactions.map((transaction) => transaction.symbol);
      //const prices = await getPrices(symbols);
      // create the data to display
      const data = transactions.map((transaction) => {
        //const price = prices.find((price) => price.symbol === transaction.symbol)
          //.price;
        return {
          libelle: transaction.symbol,
          quantite: transaction.quantity,
          valeurActuelle: 200,
          variationDollar: 200 * transaction.quantity - transaction.valueAtExecution,
          variationPourcentage: ((200 * transaction.quantity - transaction.valueAtExecution) / transaction.valueAtExecution * 100).toFixed(2),
          gain: (200 - transaction.valueAtExecution) * transaction.quantity,
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

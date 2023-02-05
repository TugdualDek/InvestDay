import React, { useEffect } from "react";
import TableTransactionStyles from "../styles/TableTransaction.module.css";
function TableWallet({ activeWalletTransactions }) {
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
    console.log("data", activeWalletTransactions);
    if (activeWalletTransactions) {
      let data = activeWalletTransactions.map((item) => {
        return {
          libelle: item?.priceAtTime?.isAdmin ? "Admin" : "Nom stock",
          quantite: item?.amount,
          valeurAchat: item?.priceAtTime.price,
          valeurActuelle: item?.priceAtTime.price,
        };
      });
    }
    setData(data);
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
        {data.map((item, index) => (
          <tr key={index} className={TableTransactionStyles.tr}>
            <td data-label="Libellé" className={TableTransactionStyles.td}>
              {item?.libelle}
            </td>
            <td data-label="Quantité" className={TableTransactionStyles.td}>
              {item?.quantite}
            </td>
            <td data-label="Val Achat" className={TableTransactionStyles.td}>
              {item?.valeurAchat} $
            </td>
            <td data-label="Val Actuelle" className={TableTransactionStyles.td}>
              {item?.valeurActuelle} $
            </td>
            <td data-label="Var $" className={TableTransactionStyles.td}>
              {item?.valeurActuelle - item?.valeurAchat} $
            </td>
            <td data-label="Var %" className={TableTransactionStyles.td}>
              {((item?.valeurActuelle - item?.valeurAchat) /
                item?.valeurAchat) *
                100}{" "}
              %
            </td>
            <td data-label="Gain" className={TableTransactionStyles.td}>
              {(item?.valeurActuelle - item?.valeurAchat) * item?.quantite} $
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

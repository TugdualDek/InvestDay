import React from "react";
import TableTransactionStyles from "../styles/Ranks.module.css";
function TableRanks(props) {
  //iterate through the data and remove the admin
  const data = props.data.filter((item) => item?.user.isAdmin === false);
  return (
    //put the 3 first in a podium and the rest in a table
    <div className={TableTransactionStyles.container}>
      <div className={TableTransactionStyles.podium}>
        <div className={TableTransactionStyles.podiumItem}>
          <div className={TableTransactionStyles.podiumItemRank}>
            2eme place :
          </div>
          <div className={TableTransactionStyles.podiumItemName}>
            Wallet n°{data[1]?.id}
          </div>
          <div className={TableTransactionStyles.podiumItemScore}>
            {data[1]?.publicWalletValue
              ? (data[1]?.publicWalletValue).toFixed(2)
              : 0}
            $
          </div>
          <div className={TableTransactionStyles.podiumItemIsep}>
            {data[1]?.user.name}
          </div>
        </div>
        <div className={TableTransactionStyles.podiumItem}>
          <div className={TableTransactionStyles.podiumItemRank}>
            1ere place :
          </div>
          <div className={TableTransactionStyles.podiumItemName}>
            Wallet n°{data[0]?.id}
          </div>
          <div className={TableTransactionStyles.podiumItemScore}>
            {data[0]?.publicWalletValue
              ? (data[0]?.publicWalletValue).toFixed(2)
              : 0}
            $
          </div>
          <div className={TableTransactionStyles.podiumItemIsep}>
            {data[0]?.user.name}
          </div>
        </div>
        <div className={TableTransactionStyles.podiumItem}>
          <div className={TableTransactionStyles.podiumItemRank}>
            3eme place :
          </div>
          <div className={TableTransactionStyles.podiumItemName}>
            Wallet n°{data[2]?.id}
          </div>
          <div className={TableTransactionStyles.podiumItemScore}>
            {data[2]?.publicWalletValue
              ? (data[2]?.publicWalletValue).toFixed(2)
              : 0}
            $
          </div>
          <div className={TableTransactionStyles.podiumItemIsep}>
            {data[2]?.user.name}
          </div>
        </div>
      </div>
      <table className={TableTransactionStyles.transactionTable}>
        <thead>
          <tr className={TableTransactionStyles.tr}>
            <th className={TableTransactionStyles.th}>Rang</th>
            {/* <th className={TableTransactionStyles.th}>Prenom</th> */}
            <th className={TableTransactionStyles.th}>Nom</th>
            <th className={TableTransactionStyles.th}>Wallet Id</th>
            <th className={TableTransactionStyles.th}>Valeur portefeuille</th>
          </tr>
        </thead>
        <tbody>
          {data.map(
            (item, index) =>
              // check if user is admin or not
              // begin at 4 because the first 3 are in the podium and end at 10
              // because we only want to display the 10 first
              index >= 3 &&
              index < 10 && (
                // if not admin, display the user
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
                    {item?.user.name
                      ? item?.user.name
                      : item?.user.email.match(/^([^@]*)@/)[1]}
                  </td>
                  <td
                    data-label="Wallet Id"
                    className={TableTransactionStyles.td}
                  >
                    {item?.id ? item?.id : "N/A"}
                  </td>
                  <td
                    data-label="Valeur Portefeuille"
                    className={TableTransactionStyles.td}
                  >
                    {(item?.publicWalletValue).toFixed(2)}
                  </td>
                </tr>
              )
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TableRanks;

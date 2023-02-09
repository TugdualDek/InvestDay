import Head from "next/head";

import { Inter } from "@next/font/google";
import homeStyles from "../../styles/Home.module.css";
import marketStyles from "../../styles/Market.module.css";

import InfoBox from "../../components/InfoBox.component.jsx";
import TableSearch from "../../components/TableSearch.component.jsx";
// import NavBar from "./NavBar.jsx/index.js.js.js";
import DashBoardLayout from "../../components/layouts/DashBoard.layout";
import { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { useFetch } from "../../context/FetchContext.js";

import wallet_image from "src/public/assets/wallet.svg";
import Button from "../../components/Button.component";

const inter = Inter({ subsets: ["latin"] });

export default function Market(this: any) {
  const [data, setData] = useState();
  const [input, setInput] = useState("");
  const fetch = useFetch();
  let tmpName;

  const onChange = (e) => {
    tmpName = e.target.value;
    setInput(tmpName);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && input !== null) {
      fetchSearch(input);
    }
  };

  function fetchSearch(symbol: string) {
    return fetch
      .get("/api/stock/search?term=" + symbol)
      .then((response) => {
        return response;
      })
      .then((data) => setData(data))
      .catch((error) => {
        console.log(error);
      });
  }

  let list = [];

  //check if data is not undefined and not empty
  if (typeof data !== "undefined" && data.length !== 0) {
    //console.log(data);
    //get data.symbol, data.name for each dictionnary of data
    for (let i = 0; i < data.length; i++) {
      list.push({
        symbol: data[i]["symbol"],
        name: data[i]["name"],
      });
    }
    console.log(list);
  }

  const [selectedId, setSelectedId] = useState(0);
  const [cashWallet, setCash] = useState(0);
  const [assets, setAssets] = useState(0);
  const [wallets, setWallets] = useState([
    {
      id: 0,
      createdAt: "2023-01-02T17:01:34.374Z",
      userId: 0,
      transactions: [
        {
          id: 2,
          createdAt: "2023-01-02T17:01:34.611Z",
          isSellOrder: false,
          symbol: "AAPL",
          quantity: 1,
          walletId: 0,
          isAdmin: false,
          status: "PENDING",
          valueAtExecution: 0,
          executedAt: "2023-01-02T17:01:34.611Z",
        },
      ],
    },
  ]);
  useEffect(() => {
    if (wallets.length === 0) {
      setCash(0);
      setAssets(0);
      return;
    }
    setCash(calculateCash());
    setAssets(calculateAssets());
  }, [wallets, selectedId]);

  function calculateCash() {
    let cash = 0;

    // cash is equal to the sum of all the transactions.isAdmin minus the sum of all the transactions.isSellOrder * valueAtExecution * quantity plus the sum of all the transactions.isSellOrder true * valueAtExecution * quantity
    wallets[selectedId].transactions.forEach((transaction) => {
      if (transaction.isAdmin && !transaction.isSellOrder) {
        // if it's cash
        cash += transaction.valueAtExecution * transaction.quantity;
      } else if (transaction.isAdmin && transaction.isSellOrder) {
        cash -= transaction.valueAtExecution * transaction.quantity;
      } else {
        if (transaction.isSellOrder) {
          // if it's sold
          cash += transaction.valueAtExecution * transaction.quantity;
        } else {
          // if it's a stock and isn't sold
          cash -= transaction.valueAtExecution * transaction.quantity;
        }
      }
    });
    return cash;
  }
  // assets is equal to the sum of all the transactions.isSellOrder false * valueAtExecution * quantity
  function calculateAssets() {
    let assets = 0;
    wallets[selectedId].transactions.forEach((transaction) => {
      if (!transaction.isAdmin) {
        if (!transaction.isSellOrder) {
          // if it's a stock and isn't sold
          assets += transaction.valueAtExecution * transaction.quantity;
        }
      }
    });
    return assets;
  }
  async function refreshWallets() {
    const userWallets = await fetch.get("/api/wallet");
    setWallets(userWallets);
  }

  useEffect(() => {
    refreshWallets();
  }, []);

  return (
    <>
      <Head>
        <title>InvestTrade - Home</title>
        <meta name="description" content="Page d'accueil" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={homeStyles.pageContainer}>
        <div className={homeStyles.headerContainer}>
          <h1>Rechercher une valeur</h1>
          {wallets.map((wallet, index) => (
            <Button
              key={index}
              title={`${index + 1}`}
              selected={selectedId === index}
              onClick={() => setSelectedId(index)}
            />
          ))}
          <div className={homeStyles.infoBoxContainer}>
            <InfoBox
              title={`Cash portefeuille n°${selectedId + 1}`}
              desc={wallets ? cashWallet + " $" : "$"}
              icon={wallet_image}
            />
          </div>
        </div>
        <div className={homeStyles.contentContainer}>
          <div className={marketStyles.searchInput}>
            <div className={marketStyles.formSubmit}>
              <input
                className={marketStyles.formSubmit}
                type="text"
                placeholder="Rechercher..."
                name="value"
                value={input}
                onChange={onChange}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>
          <div className={homeStyles.tableContainer}>
            <TableSearch data={list} />
          </div>
        </div>
      </main>
    </>
  );
}

Market.getLayout = function getLayout(page: AppProps) {
  return <DashBoardLayout>{page}</DashBoardLayout>;
};

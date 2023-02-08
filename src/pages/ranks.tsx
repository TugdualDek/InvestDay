import Head from "next/head";
import { Inter } from "@next/font/google";
import homeStyles from "../styles/Home.module.css";
import marketStyles from "../styles/Market.module.css";
import InfoBox from "../components/InfoBox.component.jsx";
import TableRanks from "../components/TableRanks.component.jsx";
import DashBoardLayout from "../components/layouts/DashBoard.layout";
import { AppProps } from "next/app";

import wallet_image from "src/public/assets/wallet.svg";
import { useEffect, useState } from "react";
import { useFetch } from "../context/FetchContext";
import Button from "../components/Button.component";

const inter = Inter({ subsets: ["latin"] });

export default function Ranks() {
  const fetch = useFetch();
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
          executed: false,
          executedAt: "2023-01-02T17:01:34.609Z",
          amount: 1,
          walletId: 8,
          priceAtTimeId: 2,
          stockId: null,
          priceAtTime: {
            id: 2,
            timestamp: "2023-01-02T17:01:34.602Z",
            price: 10000,
            stockId: null,
            isAdmin: true,
          },
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
    wallets[selectedId].transactions.forEach((transaction) => {
      if (!transaction.priceAtTime.stockId) {
        // if it's cash or is sold
        cash += transaction.priceAtTime.price * transaction.amount;
      }
    });
    return cash;
  }
  function calculateAssets() {
    let cash = 0;
    wallets[selectedId].transactions.forEach((transaction) => {
      if (transaction.priceAtTime.stockId && !transaction.priceAtSoldTime) {
        // if it's a stock and isn't sold
        cash += transaction.priceAtTime.price * transaction.amount;
      }
    });
    return cash;
  }
  async function refreshWallets() {
    const userWallets = await fetch.get("http://localhost:3000/api/wallet");
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
          <h1>Classement</h1>
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
              title={`Votre portefeuille n°${selectedId + 1}`}
              desc={wallets ? cashWallet + assets + " $" : "$"}
              icon={wallet_image}
            />
          </div>
        </div>
        <div className={homeStyles.contentContainer}>
          <div className={marketStyles.searchInput}>
            <form className={marketStyles.formSubmit}>
              <input
                className={marketStyles.formSubmit}
                type="search"
                placeholder="Rechercher une personne..."
              />
            </form>
          </div>
          <div className={homeStyles.tableContainer}>
            <TableRanks />
          </div>
        </div>
      </main>
    </>
  );
}

Ranks.getLayout = function getLayout(page: AppProps) {
  return <DashBoardLayout>{page}</DashBoardLayout>;
};

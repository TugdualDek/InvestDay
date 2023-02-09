import Head from "next/head";

import homeStyles from "../styles/Home.module.css";
import Button from "../components/Button.component";
import InfoBox from "../components/InfoBox.component.jsx";
import TableTransaction from "../components/TableTransaction.component.jsx";

import DashBoardLayout from "../components/layouts/DashBoard.layout";
import { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Action, Status } from "../types/dataTransaction";

import wallet from "src/public/assets/wallet.svg";
import cash from "src/public/assets/cash.svg";
import total from "src/public/assets/total.svg";
import { useFetch } from "../context/FetchContext";

type Data = {
  date: Date;
  companie: string;
  value: number;
  quantity: number;
  action: Action;
  status: Status;
};
export default function Home() {
  const router = useRouter();
  const [data, setData] = useState([{}]);
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
          valueAtExecution: 10,
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
    wallets[selectedId].transactions.forEach((transaction) => {
        // if it's cash or is sold
        cash += transaction.valueAtExecution * transaction.quantity;
    });
    return cash;
  }
  function calculateAssets() {
    let cash = 0;
    wallets[selectedId].transactions.forEach((transaction) => {
      if (transaction.valueAtExecution && !transaction.isSellOrder) {
        // if it's a stock and isn't sold
        cash += transaction.valueAtExecution * transaction.quantity;
      }
    });
    return cash;
  }
  async function refreshWallets() {
    const userWallets = await fetch.get("http://localhost:3000/api/wallet");
    setWallets(userWallets);
  }
  const fetch = useFetch();
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
          <h1>Tableau de bord</h1>
          {wallets.map((wallet, index) => (
            <Button
              key={index}
              title={`${index + 1}`}
              selected={selectedId === index}
              onClick={() => setSelectedId(index)}
            />
          ))}
          <Button
            title={"Chercher une action"}
            onClick={() => {
              router.push("/market");
            }}
          />
        </div>
        <div className={homeStyles.contentContainer}>
          <div className={homeStyles.infoBoxContainer}>
            <InfoBox
              title={`Valeur de vos actions portefeuille n°${selectedId + 1}`}
              desc={wallets ? assets + " $" : "$"}
              icon={wallet}
            />
            <InfoBox
              title={`Cash portefeuille n°${selectedId + 1}`}
              desc={wallets ? cashWallet + " $" : "$"}
              icon={cash}
            />
            <InfoBox
              title={`Valeur totale portefeuille n°${selectedId + 1}`}
              desc={wallets ? cashWallet + assets + " $" : "$"}
              icon={total}
            />
          </div>
          <div className={homeStyles.tableContainer}>
            <TableTransaction />
          </div>
        </div>
      </main>
    </>
  );
}

Home.getLayout = function getLayout(page: AppProps) {
  return <DashBoardLayout>{page}</DashBoardLayout>;
};

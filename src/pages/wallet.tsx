import Head from "next/head";

import { Inter } from "@next/font/google";
import homeStyles from "../styles/Home.module.css";

import Button from "../components/Button.component";
import InfoBox from "../components/InfoBox.component.jsx";
import TableWallet from "../components/TableWallet.component.jsx";
// import NavBar from "./NavBar.jsx/index.js.js.js";
import { useFetch } from "../context/FetchContext.js";

import DashBoardLayout from "../components/layouts/DashBoard.layout";
import { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import wallet from "src/public/assets/wallet.svg";
import cash from "src/public/assets/cash.svg";
import total from "src/public/assets/total.svg";

const inter = Inter({ subsets: ["latin"] });

export default function Wallet() {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState(0);
  const [wallets, setWallets] = useState([]);
  async function handleNewWallet() {
    console.log("new wallet");
    const newWallet = await fetch.get("http://localhost:3000/api/wallet/new");
    refreshWallets();
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
        <title>InvestTrade - Portefeuille</title>
        <meta name="description" content="Portefeuille" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={homeStyles.pageContainer}>
        <div className={homeStyles.headerContainer}>
          <div className={homeStyles.titleContainer}>
            <h1>Portefeuille</h1>
            {wallets.map((wallet, index) => (
              <Button
                key={index}
                title={`${index + 1}`}
                selected={selectedId === index}
                onClick={() => setSelectedId(index)}
              />
            ))}
            {wallets.length < 3 && (
              <Button title={"+"} onClick={() => handleNewWallet()} />
            )}
          </div>
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
              title={"Votre portefeuille"}
              desc={"$1000"}
              icon={wallet}
            />
            <InfoBox title={"Cash"} desc={"$1000"} icon={cash} />
            <InfoBox title={"Total"} desc={"$2000"} icon={total} />
          </div>
          <div className={homeStyles.tableContainer}>
            <TableWallet />
          </div>
        </div>
      </main>
    </>
  );
}

Wallet.getLayout = function getLayout(page: AppProps) {
  return <DashBoardLayout>{page}</DashBoardLayout>;
};

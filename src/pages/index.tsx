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
import { useWallet } from "../context/WalletContext";
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
  const {
    wallets,
    walletsLines,
    selectedId,
    selectWallet,
    assetsCached,
    actualiseWalletsLines,
  } = useWallet();
  useEffect(() => {
    if (wallets) {
      if (!(walletsLines && walletsLines[selectedId])) actualiseWalletsLines();
    }
  }, [wallets, selectedId]);
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
          <div className={homeStyles.titleContainer}>
            <h1>Tableau de bord</h1>

            {wallets.map((wallet, index) => (
              <Button
                key={index}
                title={`${index + 1}`}
                selected={selectedId === index}
                onClick={() => selectWallet(index)}
              />
            ))}
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
              title={`Valeur de vos actions portefeuille n°${selectedId + 1}`}
              desc={wallets ? assetsCached.toFixed(2) + " $" : "$"}
              icon={wallet}
            />
            <InfoBox
              title={`Cash portefeuille n°${selectedId + 1}`}
              desc={wallets ? wallets[selectedId]?.cash + " $" : "$"}
              icon={cash}
            />
            <InfoBox
              title={`Valeur totale portefeuille n°${selectedId + 1}`}
              desc={
                wallets
                  ? (wallets[selectedId]?.cash + assetsCached).toFixed(2) + " $"
                  : "$"
              }
              icon={total}
            />
          </div>
          <div className={homeStyles.tableContainer}>
            {wallets && wallets[selectedId] && (
              <TableTransaction
                dataTransactions={wallets[selectedId].transactions}
              />
            )}
          </div>
        </div>
      </main>
    </>
  );
}

Home.getLayout = function getLayout(page: AppProps) {
  return <DashBoardLayout>{page}</DashBoardLayout>;
};

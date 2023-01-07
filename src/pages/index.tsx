import Head from "next/head";

import homeStyles from "../styles/Home.module.css";
import Button from "../components/Button.component";
import InfoBox from "../components/InfoBox.component.jsx";
import TableTransaction from "../components/TableTransaction.component.jsx";

import DashBoardLayout from "../components/layouts/DashBoard.layout";
import { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useState } from "react";
import { Action, Status } from "../types/dataTransaction";

import wallet from "src/public/assets/wallet.svg";
import cash from "src/public/assets/cash.svg";
import total from "src/public/assets/total.svg";

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

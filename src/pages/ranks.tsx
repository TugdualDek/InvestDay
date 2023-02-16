import Head from "next/head";
import { Inter } from "@next/font/google";
import homeStyles from "../styles/Home.module.css";
import TableRanks from "../components/TableRanks.component.jsx";
import DashBoardLayout from "../components/layouts/DashBoard.layout";
import { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { useFetch } from "../context/FetchContext";

const inter = Inter({ subsets: ["latin"] });

export default function Ranks() {
  const [dataRanks, setDataRanks] = useState([
    {
      nom: "Pepnieau",
      prenom: "Charles",
      valWallet: 600,
    },
    {
      prenom: "John",
      nom: "Doe",
      valWallet: 400,
    },
    {
      prenom: "Benoit",
      nom: "Thomas",
      valWallet: 200,
    },
    {
      prenom: "Tugdual",
      nom: "de Kerdrel",
      valWallet: 100,
    },
  ]);

  const [dataRanksShown, setDataRanksShown] = useState([]);

  const fetch = useFetch();

  useEffect(() => {
    setDataRanksShown(dataRanks);
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
        </div>

        <div className={homeStyles.contentContainer}>
          <div className={homeStyles.tableContainer}>
            <TableRanks data={dataRanksShown} />
          </div>
        </div>
      </main>
    </>
  );
}

Ranks.getLayout = function getLayout(page: AppProps) {
  return <DashBoardLayout>{page}</DashBoardLayout>;
};

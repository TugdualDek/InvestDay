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
      id: 0,
      createdAt: "2023-02-09T12:32:27.118Z",
      userId: 0,
      cash: 0,
      publicWalletValue: 0,
      datePublicUpdated: "2023-02-11T14:46:02.497Z",
      lastUpdatedValue: 0,
      dateLastUpdated: "2023-02-11T14:46:02.497Z",
      user: {
        id: 0,
        email: "admin@eleve.isep.fr",
        name: "admin",
        isAdmin: false,
      },
    },
  ]);

  const [dataRanksShown, setDataRanksShown] = useState([] as any);

  const fetch = useFetch();

  function fetchRanks() {
    return fetch
      .get("/api/wallet/rank")
      .then((response) => {
        return response;
      })
      .then((data) => {
        setDataRanksShown(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    setDataRanksShown(dataRanks);
    fetchRanks();
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

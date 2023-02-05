import Head from "next/head";
import { Inter } from "@next/font/google";
import homeStyles from "../styles/Home.module.css";
import marketStyles from "../styles/Market.module.css";
import InfoBox from "../components/InfoBox.component.jsx";
import TableRanks from "../components/TableRanks.component.jsx";
import DashBoardLayout from "../components/layouts/DashBoard.layout";
import { AppProps } from "next/app";

import wallet from "src/public/assets/wallet.svg";

const inter = Inter({ subsets: ["latin"] });

export default function Ranks() {
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
          <div className={homeStyles.infoBoxContainer}>
            <InfoBox
              title={"Votre portefeuille"}
              desc={"$1000"}
              icon={wallet}
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

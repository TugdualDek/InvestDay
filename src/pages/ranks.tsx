import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import homeStyles from "../styles/Home.module.css";
import marketStyles from "../styles/Market.module.css";
import Cash from "../components/dashboard/Cash.component.jsx";
import Button from "../components/Button.component.jsx";
import InfoBox from "../components/InfoBox.component.jsx";
import TableRanks from "../components/TableRanks.component.jsx";
// import NavBar from "./NavBar.jsx/index.js.js.js";
import DashBoardLayout from "../components/layouts/DashBoard.layout";
import { AppProps } from "next/app";
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
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
              icon={"home"}
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

Home.getLayout = function getLayout(page: AppProps) {
  return <DashBoardLayout>{page}</DashBoardLayout>;
};

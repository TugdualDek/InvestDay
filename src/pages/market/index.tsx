import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import homeStyles from "../../styles/Home.module.css";
import marketStyles from "../../styles/Market.module.css";
import Cash from "../../components/dashboard/Cash.component.jsx";
import Button from "../../components/Button.component.tsx";
import InfoBox from "../../components/InfoBox.component.jsx";
import TableSearch from "../../components/TableSearch.component.jsx";
// import NavBar from "./NavBar.jsx/index.js.js.js";
import DashBoardLayout from "../../components/layouts/DashBoard.layout";
import { AppProps } from "next/app";

import wallet from "src/public/assets/wallet.svg";

const inter = Inter({ subsets: ["latin"] });

export default function Market() {
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
          <div className={homeStyles.infoBoxContainer}>
            <InfoBox title={"Cash"} desc={"$1000"} icon={wallet} />
          </div>
        </div>
        <div className={homeStyles.contentContainer}>
          <div className={marketStyles.searchInput}>
            <form className={marketStyles.formSubmit}>
              <input
                className={marketStyles.formSubmit}
                type="search"
                placeholder="Rechercher..."
              />
            </form>
          </div>
          <div className={homeStyles.tableContainer}>
            <TableSearch />
          </div>
        </div>
      </main>
    </>
  );
}

Market.getLayout = function getLayout(page: AppProps) {
  return <DashBoardLayout>{page}</DashBoardLayout>;
};

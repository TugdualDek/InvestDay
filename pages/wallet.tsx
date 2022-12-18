import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import homeStyles from "../styles/Home.module.css";
import Cash from "../components/dashboard/Cash.component.jsx";
import Button from "../components/Button.component.jsx";
import InfoBox from "../components/InfoBox.component.jsx";
import TableWallet from "../components/TableWallet.component.jsx";
// import NavBar from "./NavBar.jsx/index.js.js.js";
import DashBoardLayout from "../components/layouts/DashBoard.layout";
import { AppProps } from "next/app";
import { useRouter } from "next/router";
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const router = useRouter();
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
          <h1>Portefeuille</h1>
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
              icon={"home"}
            />
            <InfoBox title={"Cash"} desc={"$1000"} icon={"home"} />
            <InfoBox title={"Total"} desc={"$2000"} icon={"home"} />
          </div>
          <div className={homeStyles.tableContainer}>
            <TableWallet />
          </div>
        </div>
      </main>
    </>
  );
}

Home.getLayout = function getLayout(page: AppProps) {
  return <DashBoardLayout>{page}</DashBoardLayout>;
};

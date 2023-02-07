import Head from "next/head";

import { Inter } from "@next/font/google";
import homeStyles from "../../styles/Home.module.css";
import marketStyles from "../../styles/Market.module.css";

import InfoBox from "../../components/InfoBox.component.jsx";
import TableSearch from "../../components/TableSearch.component.jsx";
// import NavBar from "./NavBar.jsx/index.js.js.js";
import DashBoardLayout from "../../components/layouts/DashBoard.layout";
import { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { useFetch } from "../../context/FetchContext.js";

import wallet from "src/public/assets/wallet.svg";

const inter = Inter({ subsets: ["latin"] });

export default function Market(this: any) {
  const [data, setData] = useState();
  const [input, setInput] = useState("");
  const fetch = useFetch();
  let tmpName;

  const onChange = (e) => {
    tmpName = e.target.value;
    setInput(tmpName);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && input !== null) {
      fetchSearch(input);
    }
  };

  function fetchSearch(symbol: string) {
    return fetch
      .get("http://localhost:3000/api/stock/search?term=" + symbol)
      .then((response) => {
        return response;
      })
      .then((data) => setData(data))
      .catch((error) => {
        console.log(error);
      });
  }

  let list = [];

  //check if data is not undefined and not empty
  if (typeof data !== "undefined" && data.length !== 0) {
    //console.log(data);
    //get data.symbol, data.name for each dictionnary of data
    for (let i = 0; i < data.length; i++) {
      list.push({
        symbol: data[i]["symbol"],
        name: data[i]["name"],
      });
    }
    console.log(list);
  }

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
            <div className={marketStyles.formSubmit}>
              <input
                className={marketStyles.formSubmit}
                type="text"
                placeholder="Rechercher..."
                name="value"
                value={input}
                onChange={onChange}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>
          <div className={homeStyles.tableContainer}>
            <TableSearch data={list} />
          </div>
        </div>
      </main>
    </>
  );
}

Market.getLayout = function getLayout(page: AppProps) {
  return <DashBoardLayout>{page}</DashBoardLayout>;
};

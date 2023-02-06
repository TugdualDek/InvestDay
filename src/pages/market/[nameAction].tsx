import Head from "next/head";

import homeStyles from "../../styles/Home.module.css";
import DashBoardLayout from "../../components/layouts/DashBoard.layout";
import { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useFetch } from "../../context/FetchContext.js";

import jwt from "jsonwebtoken";
import { Request } from "../../types/request.type";

const fakeData = [
  {
    name: "01 Avril",
    price: 0,
  },
];

// function fetchData(symbol: string) {
//   return fetch("http://localhost:3000/api/stock/info?symbol=" + symbol)
//     .then((response) => {
//       return response.json();
//     })
//     .then((data) => setData(data))
//     .catch((error) => {
//       console.log(error);
//     });
// }

export default function detailAction(req: Request) {
  const [data, setData] = useState(fakeData);
  const router = useRouter();
  const actionName = router.query.nameAction;

  function fetchData(symbol: string) {
    return fetch
      .get("http://localhost:3000/api/stock/info?symbol=" + symbol)
      .then((response) => {
        return response;
      })
      .then((data) => setData(data))
      .catch((error) => {
        console.log(error);
      });
  }
  var donneesFinancieres;
  donneesFinancieres = data["results"];
  const keys = Object.keys(donneesFinancieres[0]);
  //for (let i = 0; i < keys.length; i++) {
  //var values = donneesFinancieres.map((object) => object[keys[i]]);
  //console.log(values);
  //}
  console.log(donneesFinancieres);
  useEffect(() => {
    fetchData(actionName);
  }, []);

  const fetch = useFetch();

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
          <h1>Informations : {actionName}</h1>
          <p>Graphique {actionName}</p>
        </div>
      </main>
    </>
  );
}

detailAction.getLayout = function getLayout(page: AppProps) {
  return <DashBoardLayout>{page}</DashBoardLayout>;
};

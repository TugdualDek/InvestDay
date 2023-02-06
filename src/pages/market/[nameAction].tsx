import Head from "next/head";

import homeStyles from "../../styles/Home.module.css";
import DashBoardLayout from "../../components/layouts/DashBoard.layout";
import { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useFetch } from "../../context/FetchContext.js";

import jwt from "jsonwebtoken";
import Plot from "react-plotly.js";
import { Request } from "../../types/request.type";

const fakeData = [
  {
    name: "01 Avril",
    price: 0,
  },
];

export default function detailAction(req: Request) {
  const [data, setData] = useState(fakeData);
  const router = useRouter();
  const { nameAction } = router.query;

  const fetch = useFetch();

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
  console.log(donneesFinancieres);
  let list = {
    v: [],
    vw: [],
    o: [],
    c: [],
    h: [],
    l: [],
    t: [],
    n: [],
  };

  // check if donneesFinancieres is defined and if length is greater than 0 (not empty)
  if (
    typeof donneesFinancieres !== "undefined" &&
    donneesFinancieres.length > 0
  ) {
    for (let i = 0; i < donneesFinancieres.length; i++) {
      list.v.push(donneesFinancieres[i].v);
      list.vw.push(donneesFinancieres[i].vw);
      list.o.push(donneesFinancieres[i].o);
      list.c.push(donneesFinancieres[i].c);
      list.h.push(donneesFinancieres[i].h);
      list.l.push(donneesFinancieres[i].l);
      list.t.push(donneesFinancieres[i].t);
      list.n.push(donneesFinancieres[i].n);
    }
  }

  //transform all elements of list.t to date with format yyy-mm-dd
  for (let i = 0; i < list.t.length; i++) {
    list.t[i] = new Date(list.t[i]).toISOString().slice(0, 10);
  }

  console.log(list);

  var trace1 = {
    x: list.t,
    close: list.c,
    decreasing: { line: { color: "#7F7F7F" } },

    high: list.h,
    increasing: { line: { color: "#17BECF" } },

    line: { color: "rgba(31,119,180,1)" },

    low: list.l,
    open: list.o,
    type: "candlestick",
    xaxis: "x",
    yaxis: "y",
  };

  var dataChart = [trace1];

  useEffect(() => {
    fetchData(nameAction);
  }, [nameAction]);

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
          <h1>Informations : {nameAction}</h1>
          <p>Graphique {nameAction}</p>
        </div>
        <div className={homeStyles.chartContainer}>
          <Plot
            data={dataChart}
            layout={{
              title: "Graphique de l'action " + nameAction,
              width: 1080,
              height: 720,
            }}
            responsive="true"
          />
        </div>
      </main>
    </>
  );
}

detailAction.getLayout = function getLayout(page: AppProps) {
  return <DashBoardLayout>{page}</DashBoardLayout>;
};

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
  const [detail, setDetail] = useState({} as any);
  const router = useRouter();
  const { nameAction } = router.query;

  const fetch = useFetch();

  var name = "";
  var market_cap = "";
  var number = "";
  var prix = "";

  function fetchDetail(symbol: string) {
    return fetch
      .get("http://localhost:3000/api/stock/detail?symbol=" + symbol)
      .then((response) => {
        return response;
      })
      .then((data) => setDetail(data))
      .catch((error) => {
        console.log(error);
      });
  }

  var details = detail["results"];

  //check if details is not undefined
  if (typeof details !== "undefined") {
    name = details.name;
    market_cap = details.market_cap;
    number = details.weighted_shares_outstanding;
    var market_cap_int = Number(market_cap);
    var number_int = Number(number);
    prix = String(market_cap_int / number_int);
  }

  function fetchData(symbol: string, time: string) {
    return fetch
      .get(
        "http://localhost:3000/api/stock/info?symbol=" +
          symbol +
          "&time=" +
          time
      )
      .then((response) => {
        return response;
      })
      .then((data) => setData(data))
      .catch((error) => {
        console.log(error);
      });
  }

  //check if data["queryCount"] is defined and if it is gretaer than 0 (not empty)
  if (typeof data["queryCount"] !== "undefined" && data["queryCount"] > 0) {
    var donneesFinancieres;
    donneesFinancieres = data["results"];
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

    var trace1 = {
      x: list.t,
      close: list.c,
      decreasing: { line: { color: "#7F7F7F" } },

      high: list.h,
      increasing: { line: { color: "#17BECF" } },

      line: { color: "rgba(31,119,180,1)" },

      low: list.l,
      open: list.o,
      volume: list.v,
      type: "candlestick",
      xaxis: "x",
      yaxis: "y",
    };

    var dataChart = [trace1];
  }

  useEffect(() => {
    fetchData(nameAction, "1d");
    fetchDetail(nameAction);
  }, [nameAction, "1d"]);

  //setInterval(fetchDetail, 5000);

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
        <div>
          <button onClick={() => fetchData(nameAction, "1d")}>1D</button>
          <button onClick={() => fetchData(nameAction, "1w")}>1W</button>
          <button onClick={() => fetchData(nameAction, "1m")}>1M</button>
        </div>
        <div className={homeStyles.chartContainer}>
          <div className={homeStyles.buyContainer}>
            {/* display name of company */}
            <h1>{name}</h1>
            {/* //display market capitalisation */}
            <p>
              Capitalisation boursière : <br /> {market_cap}
            </p>
            {/* //display number of action */}
            <p>
              Actions en circulations : <br />
              {number}
            </p>
            <p>
              Prix actuel : <br />
              {prix}
            </p>
            <input type="number" />
            <button>Acheter</button>
          </div>
          <div className={homeStyles.plotContainer}>
            <Plot
              className={homeStyles.plot}
              data={dataChart}
              layout={{
                title: "Graphique de l'action " + nameAction,
                xaxis: { title: "Date" },
                yaxis: { title: "Prix de l'action" },
              }}
              responsive="true"
            />
          </div>
        </div>
      </main>
    </>
  );
}

detailAction.getLayout = function getLayout(page: AppProps) {
  return <DashBoardLayout>{page}</DashBoardLayout>;
};

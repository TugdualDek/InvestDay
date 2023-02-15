import Head from "next/head";

import homeStyles from "../../styles/Home.module.css";
import DashBoardLayout from "../../components/layouts/DashBoard.layout";
import { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useFetch } from "../../context/FetchContext.js";
import Popup from "../../components/Popup.component.jsx";
import jwt from "jsonwebtoken";
import { Request } from "../../types/request.type";
import InfoBox from "../../components/InfoBox.component";
import { useWallet } from "../../context/WalletContext";
import wallet_image from "src/public/assets/wallet.svg";
import Highcharts from "highcharts/highstock";
import HighchartsExporting from "highcharts/modules/exporting";
import HighchartsReact from "highcharts-react-official";
import Image from "next/image";

if (typeof Highcharts === "object") {
  HighchartsExporting(Highcharts);
}

const fakeData = [
  {
    name: "01 Avril",
    price: 0,
  },
];

export default function detailAction(req: Request) {
  const [modal, setModal] = useState(false);
  const [logo, setLogo] = useState("");
  const [data, setData] = useState(fakeData);
  const [detail, setDetail] = useState({} as any);
  const router = useRouter();
  const { wallets, selectedId, selectWallet, assetsCached } = useWallet();
  const { nameAction } = router.query;
  var floor = Math.floor,
    abs = Math.abs,
    log = Math.log,
    round = Math.round,
    min = Math.min;
  var abbrev = ["K", "M", "B"]; // abbreviations in steps of 1000x; extensible if need to edit

  function toggleModalState() {
    setModal((prevState) => !prevState);
  }

  function rnd(n: number, precision: number) {
    var prec = 10 ** precision;
    return round(n * prec) / prec;
  }

  function format(n: number) {
    var base = floor(log(abs(n)) / log(1000));
    var suffix = abbrev[min(abbrev.length - 1, base - 1)];
    base = abbrev.indexOf(suffix) + 1;
    return suffix ? rnd(n / 1000 ** base, 2) + suffix : "" + n;
  }

  const fetch = useFetch();

  var name = "";
  var market_cap = "";
  var number = "";
  var prix = "";

  function fetchDetail(symbol: string) {
    return fetch
      .get("/api/stock/detail?symbol=" + symbol)
      .then((response) => {
        return response;
      })
      .then((data) => setDetail(data))
      .catch((error) => {
        console.log(error);
      });
  }

  function fetchLogo(url: string) {
    return fetch
      .get("/api/stocks/getLogo?" + url)
      .then((response) => {
        return response;
      })
      .then((data) => setLogo(data))
      .catch((error) => {
        console.log(error);
      });
  }

  var details = detail["results"];
  console.log(details);

  //check if details is not undefined
  if (typeof details !== "undefined") {
    // check if details[0] is defined and if it is not empty
    if (typeof details[0] !== "undefined" && details[0] !== null) {
      var urlToPass = details["branding"]["logo_url"];

      name = details[0].name;
      market_cap = "";
      number = "";
      prix = String(details[0].price);
    } else {
      console.log(details);
      name = details.name;
      market_cap = details.market_cap;
      number = details.weighted_shares_outstanding;
      var market_cap_int = Number(market_cap);
      var number_int = Number(number);
      //prix = String(market_cap_int / number_int);
      //prix is equal to market_cap divided by number if they exists otherwise equals to details.price
      prix = (market_cap_int / number_int).toFixed(2);
    }
  } else {
    name = "Chargement...";
    market_cap = "Chargement...";
    number = "Chargement...";
    prix = "Chargement...";
  }

  console.log(prix);

  function fetchData(symbol: string, time: string) {
    return fetch
      .get("/api/stock/info?symbol=" + symbol)
      .then((response) => {
        return response;
      })
      .then((data) => setData(data))
      .catch((error) => {
        console.log(error);
      });
  }

  let options = {};

  //check if data["queryCount"] is defined and if it is gretaer than 0 (not empty)
  if (typeof data["queryCount"] !== "undefined" && data["queryCount"] > 0) {
    var donneesFinancieres;
    donneesFinancieres = data["results"];
    let list = [] as any;

    // check if donneesFinancieres is defined and if length is greater than 0 (not empty)
    if (
      typeof donneesFinancieres !== "undefined" &&
      donneesFinancieres.length > 0
    ) {
      for (let i = 0; i < donneesFinancieres.length; i++) {
        // put in the list an array with the values of t and c
        list.push([donneesFinancieres[i].t, donneesFinancieres[i].c]);
      }
    }

    options = {
      chart: {
        //width: 800,
        height: 600,
      },
      title: {
        text: "Graphique : " + nameAction,
      },
      series: [
        {
          data: list,
          name: "prix",
        },
      ],
      responsive: {
        rules: [
          {
            condition: {
              maxWidth: 500,
            },
            chartOptions: {
              chart: {
                height: 300,
              },
              subtitle: {
                text: null,
              },
              navigator: {
                enabled: false,
              },
            },
          },
        ],
      },
    };
  }

  useEffect(() => {
    fetchData(nameAction as string, "1d");
    fetchDetail(nameAction as string);
    fetchLogo(urlToPass);
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
          <div className={homeStyles.infoBoxContainer}>
            <InfoBox
              title={`Cash portefeuille n°${selectedId + 1}`}
              desc={
                wallets ? (wallets[selectedId]?.cash).toFixed(2) + " $" : "$"
              }
              icon={wallet_image}
            />
          </div>
          <div className={homeStyles.titleContainer}>
            <Popup
              title="Acheter une action :"
              subtitle="Quantité :"
              symbol={nameAction}
              sell={false}
            />
          </div>
        </div>
        <div className={homeStyles.chartContainer}>
          <div className={homeStyles.chartHeaderContainer}>
            <div>
              <Image src={logo} alt={"icone entreprise"}></Image>
              <h1>{name}</h1>
            </div>
            <div>
              <p>{prix}</p>
            </div>
          </div>
          <div className={homeStyles.plotContainer}>
            <HighchartsReact
              containerProps={{ style: { width: "90%" } }}
              highcharts={Highcharts}
              constructorType={"stockChart"}
              options={options}
            />
          </div>

          <div className={homeStyles.buyContainer}>
            <p>
              Capitalisation boursière : <br />{" "}
              {format(market_cap as unknown as number)}
            </p>
            <p>
              Actions en circulations : <br />
              {format(number as unknown as number)}
            </p>
          </div>
        </div>
      </main>
    </>
  );
}

detailAction.getLayout = function getLayout(page: AppProps) {
  return <DashBoardLayout>{page}</DashBoardLayout>;
};

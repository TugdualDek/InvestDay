import Head from "next/head";
import Image from "next/image";
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
import { useAuthentification } from "../../context/AuthContext";
if (typeof Highcharts === "object") {
  HighchartsExporting(Highcharts);
}

export default function DetailAction(req: Request) {
  const [logo, setLogo] = useState("");
  const [data, setData] = useState([] as any);
  const [detail, setDetail] = useState({} as any);
  const { user, isAuthenticated } = useAuthentification();
  const [dataCleaned, setDataCleaned] = useState({
    name: "-",
    market_cap: "-",
    number: "-",
    prix: "-",
  });
  const router = useRouter();
  const { wallets, selectedId, selectWallet, assetsCached, getPrice } =
    useWallet();
  const { nameAction } = router.query;
  var floor = Math.floor,
    abs = Math.abs,
    log = Math.log,
    round = Math.round,
    min = Math.min;
  var abbrev = ["K", "M", "B"]; // abbreviations in steps of 1000x; extensible if need to edit

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

  async function fetchDetail(symbol: string) {
    try {
      const response = await fetch.get("/api/stock/detail?symbol=" + symbol);
      let data = response;
      let urlToPass = data["results"]?.branding?.logo_url;
      fetchLogo(urlToPass);
      const price = await getPrice(symbol);
      return setDetail({ ...data["results"], price });
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchLogo(url: string) {
    const logo = await fetch.get("/api/stock/getLogo?url=" + url, true);
    // console.log("LOGO", logo);
    setLogo(logo);
  }

  useEffect(() => {
    if (!detail) return;
    console.log("DETAIL", detail);
    if (detail[0]) {
      setDataCleaned({
        name: detail[0].name,
        market_cap: "",
        number: "",
        prix: String(detail[0].price),
      });
    } else {
      setDataCleaned({
        name: detail.name,
        market_cap: format(detail.market_cap),
        number: format(detail.weighted_shares_outstanding),
        prix: String(
          (Number(detail.market_cap) / Number(detail.number)).toFixed(2)
        ),
      });
    }
  }, [detail]);
  //check if details is not undefined

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
    if (user && isAuthenticated && nameAction) {
      fetchData(nameAction as string, "1d");
      fetchDetail(nameAction as string);
    }
  }, [router, isAuthenticated, user]);

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
                //check if wallets is not undefined and if it is not empty and if not, then return the cash of the selected wallet

                typeof wallets !== "undefined" && wallets.length > 0
                  ? (wallets[selectedId]?.cash || 0).toFixed(2) + " $"
                  : "$"
              }
              icon={wallet_image}
            />
          </div>
          <div className={homeStyles.titleContainer}>
            <Popup
              title={detail.name}
              subtitle="Achat"
              maxCount={Number(
                ((wallets[selectedId]?.cash || 0) / detail.price).toFixed(1)
              )}
              symbol={nameAction}
              detail={detail}
              sell={false}
            />
          </div>
        </div>
        <div className={homeStyles.chartContainer}>
          <div className={homeStyles.chartHeaderContainer}>
            <div>
              {typeof logo !== "undefined" && logo.length > 0 ? (
                <Image
                  src={logo}
                  width={100}
                  height={100}
                  alt={"icone entreprise"}
                ></Image>
              ) : (
                ""
              )}
              {/* <Image
                src={logo}
                width={100}
                height={100}
                alt={"icone entreprise"}
              ></Image> */}
              {/* {logo ? logo : ""} */}
              <h1>{dataCleaned.name}</h1>
            </div>
            <div>
              <p className={homeStyles.priceText}>{detail.price}$</p>
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
              {format(dataCleaned.market_cap as unknown as number)}
            </p>
            <p>
              Actions en circulations : <br />
              {format(dataCleaned.number as unknown as number)}
            </p>
          </div>
        </div>
      </main>
    </>
  );
}

DetailAction.getLayout = function getLayout(page: AppProps) {
  return <DashBoardLayout>{page}</DashBoardLayout>;
};

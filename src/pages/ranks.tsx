import Head from "next/head";
import { Inter } from "@next/font/google";
import homeStyles from "../styles/Home.module.css";
import marketStyles from "../styles/Market.module.css";
import InfoBox from "../components/InfoBox.component.jsx";
import TableRanks from "../components/TableRanks.component.jsx";
import DashBoardLayout from "../components/layouts/DashBoard.layout";
import { AppProps } from "next/app";

import wallet_image from "src/public/assets/wallet.svg";
import { useEffect, useState } from "react";
import { useFetch } from "../context/FetchContext";
import Button from "../components/Button.component";

const inter = Inter({ subsets: ["latin"] });

export default function Ranks() {
  const [dataRanks, setDataRanks] = useState([
    {
      nom: "Pepnieau",
      prenom: "Charles",
      valWallet: 600,
    },
    {
      prenom: "John",
      nom: "Doe",
      valWallet: 400,
    },
    {
      prenom: "Benoit",
      nom: "Thomas",
      valWallet: 200,
    },
    {
      prenom: "Tugdual",
      nom: "de Kerdrel",
      valWallet: 100,
    },
  ]);
  const [dataRanksShown, setDataRanksShown] = useState(dataRanks);

  const fetch = useFetch();
  const [selectedId, setSelectedId] = useState(0);
  const [cashWallet, setCash] = useState(0);
  const [assets, setAssets] = useState(0);
  const [wallets, setWallets] = useState([
    {
      id: 0,
      createdAt: "2023-01-02T17:01:34.374Z",
      userId: 0,
      transactions: [
        {
          id: 2,
          createdAt: "2023-01-02T17:01:34.611Z",
          isSellOrder: false,
          symbol: "AAPL",
          quantity: 1,
          walletId: 0,
          isAdmin: false,
          status: "PENDING",
          valueAtExecution: 0,
          executedAt: "2023-01-02T17:01:34.611Z",
        },
      ],
    },
  ]);

  async function getPrice(symbol: string) {
    try {
      const response = await fetch.get("/api/stock/lastPrice?symbol=" + symbol);

      return response;
    } catch (error) {
      console.log("error", error);
    }
  }

  useEffect(() => {
    if (wallets) {
      if (wallets.length === 0) {
        setCash(0);
        setAssets(0);
        return;
      }
      setCash(calculateCash());
      calculateAssets().then((assets) => {
        setAssets(assets);
      });
    } else {
      refreshWallets();
    }
  }, [wallets, selectedId]);

  function calculateCash() {
    let cash = 0;

    // cash is equal to the sum of all the transactions.isAdmin minus the sum of all the transactions.isSellOrder * valueAtExecution * quantity plus the sum of all the transactions.isSellOrder true * valueAtExecution * quantity
    wallets[selectedId].transactions.forEach((transaction) => {
      if (transaction.isAdmin && !transaction.isSellOrder) {
        // if it's cash
        cash += transaction.valueAtExecution * transaction.quantity;
      } else if (transaction.isAdmin && transaction.isSellOrder) {
        cash -= transaction.valueAtExecution * transaction.quantity;
      } else {
        if (transaction.isSellOrder) {
          // if it's sold
          cash += transaction.valueAtExecution * transaction.quantity;
        } else {
          // if it's a stock and isn't sold
          cash -= transaction.valueAtExecution * transaction.quantity;
        }
      }
    });
    return cash;
  }
  // assets is equal to the sum of all the transactions.isSellOrder false * valueAtExecution * quantity
  async function calculateAssets() {
    let asset = 0;
    await wallets[selectedId].transactions.forEach((transaction: any) => {
      if (!transaction.isAdmin) {
        if (!transaction.isSellOrder) {
          console.log(transaction);
          getPrice(transaction.symbol).then((price) => {
            // if it's a stock and isn't sold
            asset += price * transaction.quantity;
            setAssets(asset);
          });
        }
      }
    });
    return asset;
  }
  async function refreshWallets() {
    const userWallets = await fetch.get("/api/wallet");
    setWallets(userWallets);
  }
  useEffect(() => {
    refreshWallets();
  }, []);
  const [input, setInput] = useState("");
  let tmpName;

  const onChange = (e) => {
    tmpName = e.target.value;
    setInput(tmpName);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      //execute searchNames function and put the results into dataToBeShown
      searchNames(input);
      //then pass dataToBeShown to the table component
    }
  };

  //make a function that is able to search names from data list and put the results into dataToBeShown
  //then pass dataToBeShown to the table component
  async function searchNames(name: string = "") {
    setDataRanksShown(
      dataRanks.filter((person) => {
        if (
          person.nom.toLowerCase().includes(name.toLowerCase()) ||
          person.prenom.toLowerCase().includes(name.toLowerCase())
        ) {
          return person;
        }
      })
    );
  }

  useEffect(() => {
    searchNames("");
  }, []);

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
          {wallets.map((wallet, index) => (
            <Button
              key={index}
              title={`${index + 1}`}
              selected={selectedId === index}
              onClick={() => setSelectedId(index)}
            />
          ))}
          <div className={homeStyles.infoBoxContainer}>
            <InfoBox
              title={`Votre portefeuille n°${selectedId + 1}`}
              desc={wallets ? (cashWallet + assets).toFixed(2) + " $" : "$"}
              icon={wallet_image}
            />
          </div>
        </div>
        <div className={homeStyles.contentContainer}>
          <div className={marketStyles.searchInput}>
            <div className={marketStyles.formSubmit}>
              <input
                className={marketStyles.formSubmit}
                type="text"
                placeholder="Rechercher une personne ..."
                name="value"
                value={input}
                onChange={onChange}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>
          <div className={homeStyles.tableContainer}>
            <TableRanks data={dataRanksShown} />
          </div>
        </div>
      </main>
    </>
  );
}

Ranks.getLayout = function getLayout(page: AppProps) {
  return <DashBoardLayout>{page}</DashBoardLayout>;
};

import React, { createContext, useContext, useState, useEffect } from "react";
import { useFetch } from "./FetchContext";
import { useAuthentification } from "./AuthContext";
const WalletContext = createContext({
  actualiseWallets: (walletId) => new Promise((resolve) => resolve({})),
  actualiseWalletsLines: (walletId) => new Promise((resolve) => resolve({})),
  wallets: [],
  walletsLines: [],
  selectedId: 0,
  selectWallet: (walletId) => {},
  valuesCached: {},
  assetsCached: 0,
});

function WalletProvider({ children }) {
  const fetch = useFetch();
  const { isAuthenticated } = useAuthentification();
  const [wallets, setWallets] = useState([]);
  const [walletsLines, setWalletsLines] = useState({});
  const [selectedId, setSelectedId] = useState(0);
  const [assetsCached, setAssetsCached] = useState(0); // {symbol: {value: 123, date: 123456789}
  const [valuesCached, setValuesCached] = useState({}); // {symbol: {value: 123, date: 123456789}}
  async function actualiseWallets(walletId) {}

  useEffect(() => {
    let assetsValues = 0;
    if (walletsLines && walletsLines[selectedId]) {
      walletsLines[selectedId]?.forEach((line) => {
        if (valuesCached[line.symbol])
          assetsValues += line.quantity * valuesCached[line.symbol].value;
      });
      setAssetsCached(assetsValues);
    }
  }, [walletsLines, selectedId, valuesCached]);
  function actualiseWalletsLines(walletId) {
    if (!walletId) walletId = selectedId;
    getRealLines(wallets[walletId].transactions).then((lines) => {
      console.log("lines", lines);
      setWalletsLines({
        ...walletsLines,
        [walletId]: lines,
      });
      console.log("walletsLines", walletsLines);
      fillLines(lines, walletId);
    });
  }
  async function getRealLines(transactions) {
    let acc = transactions.reduce((acc, transaction) => {
      if (transaction.status === "EXECUTED") {
        const index = acc.findIndex(
          (item) => item.symbol === transaction.symbol
        );
        if (index === -1) {
          acc.push({
            symbol: transaction.symbol,
            quantity: transaction.quantity,
            valueAtExecution: transaction.valueAtExecution,
          });
        } else {
          acc[index].quantity += transaction.quantity;
        }
      }
      return acc;
    }, []);
    return acc;
  }
  async function getPrice(symbol) {
    console.log("getPrice", symbol);
    try {
      // Check if value is cached and less than 10 seconds old
      if (
        valuesCached[symbol] &&
        valuesCached[symbol].date > Date.now() - 10000
      ) {
        console.log("cached");
        return valuesCached[symbol].value;
      }
      const response = await fetch.get("/api/stock/lastPrice?symbol=" + symbol);
      setValuesCached((value) => {
        return {
          ...value,
          [symbol]: {
            value: response,
            date: Date.now(),
          },
        };
      });
      return response;
    } catch (error) {
      console.log("error", error);
    }
  }
  async function fillLines(lines, walletId) {
    console.log("fillLines", lines, walletId);
    lines.forEach((transaction) => {
      console.log("transaction", transaction);
      getPrice(transaction.symbol);
    });
  }

  async function calculateAssets() {
    let asset = 0;
    await wallets[selectedId].transactions.forEach((transaction) => {
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

  async function selectWallet(walletId) {
    if (walletId === selectedId) return;
    // if (walletsLines[walletId]) {
    //   let newWalletList = await actualiseWallets(walletId);
    //   if (newWalletList.length >= walletId + 1) return;
    // }
    setSelectedId(walletId);
  }
  async function refreshWallets() {
    const userWallets = await fetch.get("/api/wallet");
    setWallets(userWallets);
  }
  useEffect(() => {
    if (isAuthenticated === null) return;
    console.log("WalletProvider useEffect");
    refreshWallets();
  }, [isAuthenticated]);
  return (
    <WalletContext.Provider
      value={{
        wallets,
        selectedId,
        walletsLines,
        actualiseWallets,
        actualiseWalletsLines,
        selectWallet,
        valuesCached,
        assetsCached,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

const useWallet = () => useContext(WalletContext);
export { WalletProvider, useWallet };

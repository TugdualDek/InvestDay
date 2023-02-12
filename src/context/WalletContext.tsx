// Create a react context TestContext with TypeScript
import React, { useState, createContext, useEffect, useContext } from "react";
import { useFetch } from "./FetchContext";
import { useAuthentification } from "./AuthContext";

interface transaction {
  id?: number;
  symbol: string;
  quantity: number;
  valueAtExecution?: number;
  status?: string;
}

interface WalletContext {
  actualiseWallets: (walletId: number) => void;
  actualiseWalletsLines: (walletId: number) => void;
  wallets: Array<{
    id: number;
    name: string;
    transactions: Array<transaction>;
  }>;
  walletsLines: any;
  selectedId: number;
  selectWallet: (walletId: number) => void;
  valuesCached: { [key: string]: { value: number; date: number } };
  assetsCached: number;
}
const WalletContext = createContext<WalletContext>({
  actualiseWallets: (walletId: number) => {},
  actualiseWalletsLines: (walletId: number) => {},
  wallets: [],
  walletsLines: {},
  selectedId: 0,
  selectWallet: (walletId: number) => {},
  valuesCached: {},
  assetsCached: 0,
});

// Create a provider for components to consume and subscribe to changes
const WalletProvider = ({ children }: { children: any }) => {
  const fetch = useFetch();
  const { isAuthenticated } = useAuthentification();
  const [wallets, setWallets] = useState<
    Array<{
      id: number;
      name: string;
      transactions: Array<transaction>;
    }>
  >([]);
  const [walletsLines, setWalletsLines] = useState<any>({});
  const [selectedId, setSelectedId] = useState(0);
  const [assetsCached, setAssetsCached] = useState(0); // {symbol: {value: 123, date: 123456789}
  const [valuesCached, setValuesCached] = useState<{
    [key: string]: { value: number; date: number };
  }>({}); // {symbol: {value: 123, date: 123456789}}
  async function actualiseWallets(walletId: number) {}

  useEffect(() => {
    let assetsValues = 0;
    if (walletsLines && walletsLines[selectedId]) {
      walletsLines[selectedId]?.forEach(
        (line: { symbol: string; quantity: number }) => {
          if (valuesCached[line.symbol])
            assetsValues += line.quantity * valuesCached[line.symbol].value;
        }
      );
      setAssetsCached(assetsValues);
    }
  }, [walletsLines, selectedId, valuesCached]);
  function actualiseWalletsLines(walletId: number) {
    if (!walletId) walletId = selectedId;
    if (!wallets[walletId]) return;
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
  async function getRealLines(transactions: any) {
    let acc = transactions.reduce(
      (acc: Array<transaction>, transaction: transaction) => {
        if (transaction.status === "EXECUTED") {
          const index = acc.findIndex(
            (item: transaction) => item.symbol === transaction.symbol
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
      },
      []
    );
    return acc;
  }
  async function getPrice(symbol: string) {
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
  async function fillLines(lines: any, walletId: number) {
    console.log("fillLines", lines, walletId);
    lines.forEach((transaction: any) => {
      console.log("transaction", transaction);
      getPrice(transaction.symbol);
    });
  }

  async function selectWallet(walletId: number) {
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
        actualiseWallets,
        actualiseWalletsLines,
        wallets,
        walletsLines,
        selectedId,
        selectWallet,
        valuesCached,
        assetsCached,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

const useWallet = () => useContext(WalletContext);
export { WalletProvider, useWallet };

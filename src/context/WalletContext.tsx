// Create a react context TestContext with TypeScript
import React, {
  useState,
  createContext,
  useEffect,
  useContext,
  useRef,
} from "react";
import { useFetch } from "./FetchContext";
import { useAuthentification } from "./AuthContext";

interface transaction {
  id?: number;
  isSellOrder?: boolean;
  symbol: string;
  quantity: number;
  valueAtExecution?: number;
  status?: string;
}

interface WalletContext {
  actualiseWallets: (walletId: number) => void;
  actualiseWalletsLines: (walletId: number, wallet?: any) => void;
  actualiseWalletsList: () => void;
  wallets: Array<{
    cash?: number;
    id: number;
    name: string;
    transactions: Array<transaction>;
  }>;
  walletsLines: any;
  selectedId: number;
  selectWallet: (walletId: number) => void;
  valuesCached: { [key: string]: { value: number; date: number } };
  assetsCached: number;
  getPrice: (symbol: string) => Promise<number>;
}
const WalletContext = createContext<WalletContext>({
  actualiseWallets: (walletId: number) => {},
  actualiseWalletsLines: (walletId: number) => {},
  actualiseWalletsList: () => {},
  wallets: [],
  walletsLines: {},
  selectedId: 0,
  selectWallet: (walletId: number) => {},
  valuesCached: {},
  assetsCached: 0,
  getPrice: (symbol: string) => {
    return new Promise((resolve, reject) => {
      resolve(0);
    });
  },
});

// Create a provider for components to consume and subscribe to changes
const WalletProvider = ({ children }: { children: any }) => {
  const fetch = useFetch();
  const { isAuthenticated, user } = useAuthentification();
  const [wallets, setWallets] = useState<
    Array<{
      id: number;
      name: string;
      cash?: number;
      transactions: Array<transaction>;
    }>
  >([]);
  const [walletsLines, setWalletsLines] = useState<any>({});
  const [selectedId, setSelectedId] = useState(0);
  const [assetsCached, setAssetsCached] = useState(0); // {symbol: {value: 123, date: 123456789}
  const [valuesCached, setValuesCached] = useState<{
    [key: string]: { value: number; date: number };
  }>({}); // {symbol: {value: 123, date: 123456789}}
  const valuesCachedRef = useRef(valuesCached);
  valuesCachedRef.current = valuesCached;
  async function actualiseWallets(walletId: number) {}

  useEffect(() => {
    calculateAssets();
  }, [walletsLines, selectedId, valuesCached]);

  function calculateAssets() {
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
  }
  function actualiseWalletsLines(walletId: number, wallet: any) {
    let trans: any;

    if (!wallet) {
      if (!walletId) {
        walletId = selectedId;
      }
      if (!wallets[walletId]) {
        return;
      }
      trans = wallets[walletId].transactions;
    } else {
      if (!wallet[walletId] || !wallet[walletId].transactions) return;
      trans = wallet[walletId].transactions;
    }
    getRealLines(trans).then((lines) => {
      setWalletsLines({
        ...walletsLines,
        [walletId]: lines,
      });

      fillLines(lines, walletId);
    });
    if (wallet) calculateAssets();
  }
  async function getRealLines(transactions: any) {
    //create a function to get the quantity of each symbol in the wallet and return an array of objects with symbol and quantity
    //in the quantity, if the transaction is a sell order, the quantity is negative
    // if the quantity is 0, the symbol is not in the wallet
    //if the status is not executed, the transaction is not taken into account

    let acc: any = [];
    transactions.forEach((transaction: any) => {
      if (transaction.status === "EXECUTED") {
        let index = acc.findIndex(
          (item: any) => item.symbol === transaction.symbol
        );
        if (index === -1) {
          acc.push({
            symbol: transaction.symbol,
            quantity: transaction.isSellOrder
              ? -transaction.quantity
              : transaction.quantity,
            valueAtExecution: transaction.isSellOrder
              ? []
              : [
                  {
                    quantity: transaction.quantity,
                    price: transaction.valueAtExecution,
                  },
                ],
          });
        } else {
          acc[index].quantity += transaction.isSellOrder
            ? -transaction.quantity
            : transaction.quantity;
          if (!transaction.isSellOrder) {
            acc[index].valueAtExecution.push({
              quantity: transaction.quantity,
              price: transaction.valueAtExecution,
            });
          }
        }
      }
    });
    acc = acc.filter((item: any) => item.quantity !== 0);

    return acc;
  }
  async function getPrice(symbol: string): Promise<number> {
    try {
      // Check if value is cached and less than 10 seconds old
      if (
        valuesCachedRef.current[symbol] &&
        valuesCachedRef.current[symbol].date > Date.now() - 10000
      ) {
        console.log("from cache");
        return valuesCachedRef.current[symbol].value;
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
      return 0;
    }
  }
  async function fillLines(lines: any, walletId: number) {
    lines.forEach((transaction: any) => {
      getPrice(transaction.symbol);
    });
  }

  async function selectWallet(walletId: number) {
    if (walletId === selectedId) return;
    setSelectedId(walletId);
    actualiseWallets(walletId);
    // if (walletsLines[walletId]) {
    //   let newWalletList = await actualiseWallets(walletId);
    //   if (newWalletList.length >= walletId + 1) return;
    // }
    refreshWallets(walletId);
  }
  async function refreshWallets(walletId: number | null = null) {
    let id = walletId;
    if (walletId == null) id = selectedId;
    const userWallets = await fetch.get("/api/wallet");
    setWallets(userWallets);
    actualiseWalletsLines(id as number, userWallets);
  }

  useEffect(() => {
    // actualise selected wallet every 10 seconds
    if (!isAuthenticated || !user) return;

    const interval = setInterval(() => {
      refreshWallets();
      // console.log("cashed", valuesCachedRef.current);
    }, 4000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);
  useEffect(() => {
    if (!isAuthenticated || !user) return;
    refreshWallets();
  }, [isAuthenticated]);

  return (
    <WalletContext.Provider
      value={{
        actualiseWallets,
        actualiseWalletsLines,
        actualiseWalletsList: refreshWallets,
        wallets,
        walletsLines,
        selectedId,
        selectWallet,
        valuesCached,
        assetsCached,
        getPrice,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

const useWallet = () => useContext(WalletContext);
export { WalletProvider, useWallet };

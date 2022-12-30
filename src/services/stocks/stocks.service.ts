import { Stock } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { StockApi } from "../../types/stockapi.type";
const { API_KEY } = process.env;

async function search(term: String): Promise<StockApi[]> {
  let prisma = new PrismaClient();

  const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${term}&apikey=${API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  const matches: StockApi[] = [];
  for (let stock of data.bestMatches) {
    matches.push({
      symbol: stock["1. symbol"],
      name: stock["2. name"],
      type: stock["3. type"],
      region: stock["4. region"],
      marketOpen: stock["5. marketOpen"],
      marketClose: stock["6. marketClose"],
      timezone: stock["7. timezone"],
      currency: stock["8. currency"],
      matchScore: stock["9. matchScore"],
    });
  }

  return matches;
}

async function getRecentPrices(
  symbol: string,
  time?: string,
  isCrypto?: boolean
): Promise<any[]> {
  let prisma = new PrismaClient();
  let url = "";
  switch (time) {
    case "5min":
      if (!isCrypto)
        url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&outputsize=compact&apikey=${API_KEY}`;
      if (isCrypto) throw "Crypto details currently not available";
      url = `https://www.alphavantage.co/query?function=CRYPTO_INTRADAY&symbol=${symbol}&market=USD&outputsize=compac&interval=5min&apikey=${API_KEY}`;
      break;
    case "60min":
      if (!isCrypto)
        url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=60min&outputsize=compact&apikey=${API_KEY}`;
      if (isCrypto) throw "Crypto details currently not available";
      break;
    default:
      if (!isCrypto)
        url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}&outputsize=compact&apikey=${API_KEY}`;
      if (isCrypto)
        url = `https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=${symbol}&outputsize=compact&market=USD&apikey=${API_KEY}`;
      break;
  }
  const response = await fetch(url);
  const data = await response.json();

  return data;
}
export default { search, getRecentPrices };

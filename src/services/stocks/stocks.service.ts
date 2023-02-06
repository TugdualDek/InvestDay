import { Stock } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { StockApi } from "../../types/stockapi.type";
const { API_KEY } = process.env;
const { API_POLYGON_KEY } = process.env;

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

// Headers required to use the Launchpad product.
const edgeHeaders = {
  // X-Polygon-Edge-ID is a required Launchpad header. It identifies the Edge User requesting data.
  "X-Polygon-Edge-ID": "sampleEdgeID",
  // X-Polygon-Edge-IP-Address is a required Launchpad header. It denotes the originating IP Address of the Edge User requesting data.
  "X-Polygon-Edge-IP-Address": "92.169.154.74",
  // X-Polygon-Edge-User-Agent is an optional Launchpad header. It denotes the originating UserAgent of the Edge User requesting data.
  "X-Polygon-Edge-User-Agent": "*",
};

async function getRecentPrices(
  symbol: string,
  time?: string,
  isCrypto?: boolean
): Promise<any[]> {
  // Récupérer la date d'aujourd'hui
  var today = new Date();

  // Récupérer la date il y a 30 jours
  var thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);

  // Formater la date d'aujourd'hui
  var formattedToday = today.toISOString().slice(0, 10);

  // Formater la date il y a 30 jours
  var formattedThirtyDaysAgo = thirtyDaysAgo.toISOString().slice(0, 10);
  let prisma = new PrismaClient();
  let url = "";
  url = `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/day/${formattedThirtyDaysAgo}/${formattedToday}?adjusted=true&sort=asc&limit=120&apiKey=${API_POLYGON_KEY}`;
  // switch (time) {
  //   case "5min":
  //     if (!isCrypto)
  //       url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&outputsize=compact&apikey=${API_KEY}`;
  //     if (isCrypto) throw "Crypto details currently not available";
  //     url = `https://www.alphavantage.co/query?function=CRYPTO_INTRADAY&symbol=${symbol}&market=USD&outputsize=compac&interval=5min&apikey=${API_KEY}`;
  //     break;
  //   case "60min":
  //     if (!isCrypto)
  //       url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=60min&outputsize=compact&apikey=${API_KEY}`;
  //     if (isCrypto) throw "Crypto details currently not available";
  //     break;
  //   default:
  //     if (!isCrypto)
  //       url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}&outputsize=compact&apikey=${API_KEY}`;
  //     if (isCrypto)
  //       url = `https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=${symbol}&outputsize=compact&market=USD&apikey=${API_KEY}`;
  //     break;
  // }
  const response = await fetch(url, {
    method: "GET",
    headers: edgeHeaders,
  });

  const data = await response.json();

  return data;
}
export default { search, getRecentPrices };

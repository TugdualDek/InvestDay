import { StockApi } from "../../types/stockapi.type";
const { API_KEY } = process.env;
const { API_POLYGON_KEY } = process.env;

async function search(
  term: String,
  userId: number,
  ip: string
): Promise<StockApi[]> {
  const url = `https://api.polygon.io/v3/reference/tickers?apiKey=${API_POLYGON_KEY}&search=${term}`;
  const response = await fetch(url, {
    method: "GET",
    headers: createHeader(userId as unknown as string, ip as unknown as string),
  });
  const data = await response.json();
  const matches: StockApi[] = [];
  for (let stock of data["results"]) {
    if (
      stock?.market == "stocks" || // US Stocks
      stock?.market == "etfs" || // US ETFs
      stock?.market == "forex" || // Forex
      stock?.market == "crypto"
    ) {
      if (
        (stock?.currency_symbol &&
          stock?.currency_symbol.toUpperCase() == "USD") ||
        (stock?.currency_name && stock?.currency_name?.toUpperCase() == "USD")
      ) {
        matches.push({
          symbol: stock["ticker"],
          name: stock["name"],
          market: stock["market"],
          region: stock["locale"],
          currency: stock["currency_name"],
        });
      }
    }
  }

  return matches;
}

function createHeader(userId: string, ip: string) {
  // Headers required to use the Launchpad product.
  const edgeHeaders = {
    // X-Polygon-Edge-ID is a required Launchpad header. It identifies the Edge User requesting data.
    "X-Polygon-Edge-ID": `${userId}`,
    // X-Polygon-Edge-IP-Address is a required Launchpad header. It denotes the originating IP Address of the Edge User requesting data.
    "X-Polygon-Edge-IP-Address": `${ip}`,
    // X-Polygon-Edge-User-Agent is an optional Launchpad header. It denotes the originating UserAgent of the Edge User requesting data.
    "X-Polygon-Edge-User-Agent": "*",
  };

  return edgeHeaders;
}

enum times {
  day = "1d" as any,
  week = "1w" as any,
  month = "1m" as any,
}
async function getRecentPrices(
  symbol: string,
  time: times = times.day,
  userId: number,
  ip: string,
  isCrypto?: boolean
): Promise<any[]> {
  let url = "";
  // Récupérer la date d'aujourd'hui
  let today = new Date();
  let daybegining = new Date();
  daybegining.setDate(today.getDate() - 2 * 365);

  let formatedToday = today.toISOString().slice(0, 10);
  let formatedBeginingDate = daybegining.toISOString().slice(0, 10);
  url = `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/${times[time]}/${formatedBeginingDate}/${formatedToday}?adjusted=true&sort=asc&limit=10000&apiKey=${API_POLYGON_KEY}`;
  const response = await fetch(url, {
    method: "GET",
    headers: createHeader(userId as unknown as string, ip as unknown as string),
  });

  const data = await response.json();

  return data;
}

async function getDetailsStock(
  symbol: string,
  userId: number,
  ip: string
): Promise<any[]> {
  let url = "";
  if (symbol.startsWith("X:")) {
    url = `https://api.polygon.io/v1/summaries?ticker.any_of=${symbol}&apiKey=${API_POLYGON_KEY}`;
  } else {
    url = `https://api.polygon.io/v3/reference/tickers/${symbol}?apiKey=${API_POLYGON_KEY}`;
  }

  const response = await fetch(url, {
    method: "GET",
    headers: createHeader(userId as unknown as string, ip as unknown as string),
  });

  const data = await response.json();

  return data;
}

async function getLogoStock(
  link: string,
  userId: number,
  ip: string
): Promise<any> {
  let url = `${link}` + `?apiKey=${API_POLYGON_KEY}`;

  const response = await fetch(url, {
    method: "GET",
    headers: createHeader(userId as unknown as string, ip as unknown as string),
  });

  const svg = await response.text();

  return svg;
}

async function getLastPrice(
  symbol: string,
  userId: number,
  ip: string
): Promise<any[]> {
  let url = `https://api.polygon.io/v1/summaries?ticker.any_of=${symbol}&apiKey=${API_POLYGON_KEY}`;
  const response = await fetch(url, {
    method: "GET",
    headers: createHeader(userId as unknown as string, ip as unknown as string),
  });

  const data = await response.json();

  return data;
}

const stocksService = {
  search,
  getRecentPrices,
  getDetailsStock,
  getLastPrice,
  getLogoStock,
};
export default stocksService;

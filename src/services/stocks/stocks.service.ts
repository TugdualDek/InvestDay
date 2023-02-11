import { StockApi } from "../../types/stockapi.type";
const { API_KEY } = process.env;
const { API_POLYGON_KEY } = process.env;

async function search(term: String): Promise<StockApi[]> {
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

enum times {
  day = "1d" as any,
  week = "1w" as any,
  month = "1m" as any,
}
async function getRecentPrices(
  symbol: string,
  time: times = times.day,
  isCrypto?: boolean
): Promise<any[]> {
  let url = "";
  // Récupérer la date d'aujourd'hui
  let today = new Date();
  let daybegining = new Date();
  daybegining.setDate(
    today.getDate() - (time == times.day ? 60 : time == times.week ? 84 : 365)
  );

  let formatedToday = today.toISOString().slice(0, 10);
  let formatedBeginingDate = daybegining.toISOString().slice(0, 10);
  url = `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/${times[time]}/${formatedBeginingDate}/${formatedToday}?adjusted=true&sort=asc&limit=120&apiKey=${API_POLYGON_KEY}`;
  console.log(url);
  const response = await fetch(url, {
    method: "GET",
    headers: edgeHeaders,
  });

  const data = await response.json();

  return data;
}

async function getDetailsStock(symbol: string): Promise<any[]> {
  let url = `https://api.polygon.io/v3/reference/tickers/${symbol}?apiKey=${API_POLYGON_KEY}`;

  const response = await fetch(url, {
    method: "GET",
    headers: edgeHeaders,
  });

  const data = await response.json();

  return data;
}

async function getLastPrice(symbol: string): Promise<any[]> {
  let url = `https://api.polygon.io/v1/summaries?ticker.any_of=${symbol}&apiKey=${API_POLYGON_KEY}`;

  const response = await fetch(url, {
    method: "GET",
    headers: edgeHeaders,
  });

  const data = await response.json();

  return data;
}

export default { search, getRecentPrices, getDetailsStock, getLastPrice };

import { apiHandler } from "../../../helpers/api/api-handler";
import jwt from "jsonwebtoken";
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import getConfig from "next/config";
const { serverRuntimeConfig } = getConfig();

// listen for get request
export default apiHandler(info);

async function info(req: NextApiRequest, res: NextApiResponse<any>) {
  if (req.method !== "GET") {
    throw `Method ${req.method} not allowed`;
  }
  // get the search term
  const { symbol, time, isCrypto } = req.query;
  // get the api key from env file
  const { API_KEY } = process.env;

  // Daily history 20y
  let url = "";
  switch (time) {
    case "day":
      if (!isCrypto)
        url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}&outputsize=full&apikey=${API_KEY}`;
      if (isCrypto)
        url = `https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=${symbol}&market=USD&apikey=${API_KEY}`;
      break;
    case "5min":
      if (!isCrypto)
        url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=5min&outputsize=compact&apikey=${API_KEY}`;
      if (isCrypto) throw "Crypto details currently not available";
      url = `https://www.alphavantage.co/query?function=CRYPTO_INTRADAY&symbol=${symbol}&market=USD&interval=5min&apikey=${API_KEY}`;
      break;
    case "60min":
      if (!isCrypto)
        url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=60min&outputsize=compact&apikey=${API_KEY}`;
      if (isCrypto) throw "Crypto details currently not available";

      break;
  }
  const response = await fetch(url);
  const data = await response.json();

  // return basic user details and token
  return res.status(200).json(data);
}

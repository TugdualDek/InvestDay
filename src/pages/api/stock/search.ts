import { apiHandler } from "../../../helpers/api/api-handler";
import jwt from "jsonwebtoken";
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import getConfig from "next/config";
const { serverRuntimeConfig } = getConfig();

// listen for get request
export default apiHandler(search);

async function search(req: NextApiRequest, res: NextApiResponse<any>) {
  if (req.method !== "GET") {
    throw `Method ${req.method} not allowed`;
  }
  // get the search term
  const { term } = req.query;
  // get the api key from env file
  const { API_KEY } = process.env;

  const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${term}&apikey=${API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();

  // return basic user details and token
  return res.status(200).json(data.bestMatches);
}

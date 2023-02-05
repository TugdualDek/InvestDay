import { apiHandler } from "../../../helpers/api/api-handler";
import type { NextApiRequest, NextApiResponse } from "next";
import stocksService from "../../../services/stocks/stocks.service";
import { restClient } from "@polygon.io/client-js";
const { API_POLYGON_KEY } = process.env;

export default apiHandler(search);

async function search(req: NextApiRequest, res: NextApiResponse<any>) {
  const rest = restClient(API_POLYGON_KEY);
  if (req.method !== "GET") {
    throw `Method ${req.method} not allowed`;
  }
  const { term } = req.query;
  if (!term || typeof term !== "string") throw "Invalid search term";
  const data = await stocksService.search(term);
  return res.status(200).json(data);
}

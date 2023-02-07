import { apiHandler } from "../../../helpers/api/api-handler";
import type { NextApiRequest, NextApiResponse } from "next";
import stocksService from "../../../services/stocks/stocks.service";
//import stocksService from "../../../services/stocks/stocks.service";

// you can use the api now

export default apiHandler(details);

async function details(req: NextApiRequest, res: NextApiResponse<any>) {
  if (req.method !== "GET") {
    throw `Method ${req.method} not allowed`;
  }
  const { symbol } = req.query;

  if (typeof symbol != "string") throw "Invalid request";
  const resp = await stocksService.getDetailsStock(
    symbol.toUpperCase(),
  );

  return res.status(200).json(resp);
}

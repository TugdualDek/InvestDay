import { apiHandler } from "../../../helpers/api/api-handler";
import type { NextApiRequest, NextApiResponse } from "next";
import stocksService from "../../../services/stocks/stocks.service";

export default apiHandler(info);

async function info(req: NextApiRequest, res: NextApiResponse<any>) {
  if (req.method !== "GET") {
    throw `Method ${req.method} not allowed`;
  }
  const { symbol, time, isCrypto } = req.query;

  if (typeof symbol != "string") throw "Invalid request";
  const resp = await stocksService.getRecentPrices(
    symbol,
    time?.toString(),
    false
  );
  return res.status(200).json(resp);
}

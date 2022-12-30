import { apiHandler } from "../../../helpers/api/api-handler";
import type { NextApiRequest, NextApiResponse } from "next";
import stocksService from "../../../services/stocks/stocks.service";

export default apiHandler(search);

async function search(req: NextApiRequest, res: NextApiResponse<any>) {
  if (req.method !== "GET") {
    throw `Method ${req.method} not allowed`;
  }
  const { term } = req.query;
  if (!term || typeof term !== "string") throw "Invalid search term";
  const data = await stocksService.search(term);
  return res.status(200).json(data);
}

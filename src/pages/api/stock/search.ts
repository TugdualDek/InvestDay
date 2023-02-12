import { apiHandler } from "../../../helpers/api/api-handler";
import type { NextApiRequest, NextApiResponse } from "next";
import requestIp from 'request-ip';
import { Request } from "../../../types/request.type";
import stocksService from "../../../services/stocks/stocks.service";
const { API_POLYGON_KEY } = process.env;

export default apiHandler(search);

async function search(req: Request, res: NextApiResponse<any>) {
  //get ip address from request;
  const clientIp = requestIp.getClientIp(req);
  if (req.method !== "GET") {
    throw `Method ${req.method} not allowed`;
  }
  const { term } = req.query;
  if (!term || typeof term !== "string") throw "Invalid search term";
  const data = await stocksService.search(term, req.auth.sub, clientIp as string);
  return res.status(200).json(data);
}

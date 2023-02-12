import { apiHandler } from "../../../helpers/api/api-handler";
import type { NextApiRequest, NextApiResponse } from "next";
import stocksService from "../../../services/stocks/stocks.service";
import { Request } from "../../../types/request.type";
import requestIp from 'request-ip';
//import stocksService from "../../../services/stocks/stocks.service";

// you can use the api now

export default apiHandler(info);

async function info(req: Request, res: NextApiResponse<any>) {
  if (req.method !== "GET") {
    throw `Method ${req.method} not allowed`;
  }
  const { symbol, time, isCrypto } = req.query;

  //get ip address from request;
  const clientIp = requestIp.getClientIp(req);

  if (typeof symbol != "string") throw "Invalid request";
  enum times {
    day = "1d" as any,
    week = "1w" as any,
    month = "1m" as any,
  }
  const resp = await stocksService.getRecentPrices(
    symbol.toUpperCase(),
    time as unknown as times,
    req.auth.sub,
    clientIp as string,
    false,
  );

  return res.status(200).json(resp);
}

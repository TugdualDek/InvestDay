import { apiHandler } from "../../../helpers/api/api-handler";
import type { NextApiRequest, NextApiResponse } from "next";
import stocksService from "../../../services/stocks/stocks.service";
import { Request } from "../../../types/request.type";
import requestIp from "request-ip";
//import stocksService from "../../../services/stocks/stocks.service";

// you can use the api now

export default apiHandler(lastPrice);

async function lastPrice(req: Request, res: NextApiResponse<any>) {
  if (req.method !== "GET") {
    throw `Method ${req.method} not allowed`;
  }
  const { symbol } = req.query;

  //get ip address from request;
  const clientIp = requestIp.getClientIp(req);

  if (typeof symbol != "string") throw "Invalid request";
  const resp: any = await stocksService.getLastPrice(
    symbol.toUpperCase(),
    req.auth.sub,
    clientIp as string
  );

  //console.log(resp["results"][0].price);
  //return only thge last array from the "results" array
  return res.status(200).json(resp["results"][0].price);

  //return res.status(200).json(resp);
}

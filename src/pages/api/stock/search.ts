import { apiHandler } from "../../../helpers/api/api-handler";
import type { NextApiRequest, NextApiResponse } from "next";
import { NextRequest } from 'next/server'
import stocksService from "../../../services/stocks/stocks.service";
const { API_POLYGON_KEY } = process.env;

export default apiHandler(search);

async function search(req: NextApiRequest, res: NextApiResponse<any>) {
  //get ip address from request;
  let ip = NextRequest;
  const forwardedFor = req.headers['x-forwarded-for'] as string
  /* if(!ip && forwardedFor){
    ip = forwardedFor?.split(",").at(0) ?? "Unknown";
  } */
  console.log(req.headers);
  if (req.method !== "GET") {
    throw `Method ${req.method} not allowed`;
  }
  const { term } = req.query;
  if (!term || typeof term !== "string") throw "Invalid search term";
  const data = await stocksService.search(term, req.auth.sub);
  return res.status(200).json(data);
}

import { apiHandler } from "../../../../helpers/api/api-handler";
import type { NextApiRequest, NextApiResponse } from "next";
import { Request } from "../../../../types/request.type";
import requestIp from "request-ip";
import walletsService from "../../../../services/wallets/wallets.service";
import stocksService from "../../../../services/stocks/stocks.service";
import transactionsService from "../../../../services/transactions/transactions.service";
import { symbolName } from "typescript";
import router from "next/router";

// you can use the api now

export default apiHandler(updatePublicValue);

async function updatePublicValue(req: Request, res: NextApiResponse<any>) {
  if (req.method !== "GET") {
    throw `Method ${req.method} not allowed`;
  }
  if (!req.auth.isAdmin) throw "You are not allowed to log values of wallets";
  const { walletId } = req.query;
  const transactions = await transactionsService.findAll(walletId as string);

  return res.status(200).json(transactions);
}

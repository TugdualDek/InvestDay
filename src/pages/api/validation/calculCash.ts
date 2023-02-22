import { apiHandler } from "../../../helpers/api/api-handler";
import type { NextApiRequest, NextApiResponse } from "next";
import { Request } from "../../../types/request.type";
import requestIp from "request-ip";
import walletsService from "../../../services/wallets/wallets.service";
import stocksService from "../../../services/stocks/stocks.service";

// you can use the api now

export default apiHandler(updatePublicValue);

async function updatePublicValue(req: Request, res: NextApiResponse<any>) {
  if (req.method !== "GET") {
    throw `Method ${req.method} not allowed`;
  }
  if (!req.auth.isAdmin) throw "You are not allowed to log values of wallets";

  const clientIp = requestIp.getClientIp(req);
  if (!clientIp) throw new Error("No client IP found");

  // get all the wallets and iterate through their transactions
  // remove cash if transaction is a buy, add cash if transaction is a sell
  // then update the wallet with the new cash value

  const wallets = await walletsService.getAllWallets();
  for (const wallet of wallets) {
    let cash = 10000;
    for (const transaction of wallet.transactions) {
      if (transaction.status === "EXECUTED") {
        //check if valueAtExecution is null
        if (transaction.valueAtExecution === null) continue;
        if (transaction.isSellOrder === false) {
          cash -= transaction.valueAtExecution * transaction.quantity;
        } else if (transaction.isSellOrder === true) {
          cash += transaction.valueAtExecution * transaction.quantity;
        }
      }
    }
    //update wallet with new cash value
    await walletsService.updateCash(wallet.id, cash);
  }

  return res.status(200).json({ message: "Cash calculated" });
}

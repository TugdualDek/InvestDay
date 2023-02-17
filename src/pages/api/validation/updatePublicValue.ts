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

  const clientIp = requestIp.getClientIp(req);
  if (!clientIp) throw new Error("No client IP found");

  /* if (!req.auth.isAdmin)
    throw "You are not allowed to update values of wallets"; */
  let pricesFound: {
    [key: string]: number;
  } = {};
  async function getPriceFound(symbol: string): Promise<number> {
    if (pricesFound[symbol]) {
      return pricesFound[symbol];
    }
    const price: any = await stocksService.getLastPrice(
      symbol,
      req.auth.sub,
      clientIp as string
    );
    pricesFound[symbol] = price["results"][0].price;

    return price["results"][0].price as number;
  }

  //get the wallet and then the user
  const wallets = await walletsService.getAllWallets();

  for (let i = 0; i < wallets.length; i++) {
    let wallet = wallets[i];
    let publicAssetsValue = 0;
    // We count the number of shares of each symbol we have in the wallet
    let sharesCount: {
      [key: string]: number;
    } = {};
    for (let j = 0; j < wallet.transactions.length; j++) {
      let transaction = wallet.transactions[j];
      if (transaction.status == "EXECUTED") {
        if (transaction.isSellOrder) {
          sharesCount[transaction.symbol] =
            (sharesCount[transaction.symbol] || 0) - transaction.quantity;
        } else {
          sharesCount[transaction.symbol] =
            (sharesCount[transaction.symbol] || 0) + transaction.quantity;
        }
      }
    }
    // We then iterate through the sharesCount object to get the last price of each symbol
    for (const symbol in sharesCount) {
      const lastPrice = await getPriceFound(symbol);
      publicAssetsValue += lastPrice * sharesCount[symbol];
    }

    //update the public value of the wallet
    walletsService.updatePublicValue(
      wallet.id,
      publicAssetsValue + wallet.cash
    );
  }

  return res.status(200).json({ message: "Public values updated" });
}

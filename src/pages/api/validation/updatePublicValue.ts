import { apiHandler } from "../../../helpers/api/api-handler";
import type { NextApiRequest, NextApiResponse } from "next";
import { Request } from "../../../types/request.type";
import { PrismaClient } from "@prisma/client";
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

  //function to get the last price of a stock
  async function getLastPrice(symbol: string): Promise<number> {
    const resp = await stocksService.getLastPrice(
      symbol.toUpperCase(),
      req.auth.sub,
      clientIp as string
    );
    return resp["results"][0].price;
  }

  /* if (!req.auth.isAdmin)
    throw "You are not allowed to update values of wallets"; */

  //get the wallet and then the user
  const wallets = await walletsService.getAllWallets();

  //iterate through each wallets
  //then get all transactions of the wallet and iterate through them
  //then get the last price of the stock
  //then update the publicWalletValue of the wallet
  wallets.forEach((wallet) => {
    let publicAssetsValue = 0;
    console.log("walletId", wallet.id);
    wallet.transactions.forEach((transaction) => {
      if (transaction.status == "EXECUTED") {
        console.log("transaction", transaction);
        if (transaction.isSellOrder) {
          publicAssetsValue -=
            transaction.valueAtExecution * transaction.quantity;
          console.log("vente", publicAssetsValue);
        } else {
          stocksService
            .getLastPrice(transaction.symbol, req.auth.sub, clientIp as string)
            .then((resp) => {
              const lastPrice = resp["results"][0].price;
              publicAssetsValue +=
                (lastPrice as unknown as number) * transaction.quantity;
              console.log("achat", publicAssetsValue);
            });
        }
        /* //console.log(transaction);
        //if the transaction is a buy then get last price of the stock and add the amount to the publicWalletValue
        if (transaction.isSellOrder === false) {
          stocksService
            .getLastPrice(transaction.symbol, req.auth.sub, clientIp as string)
            .then((resp) => {
              let lastPrice = resp["results"][0].price;
              console.log("lastPrice", transaction.symbol, lastPrice);
              publicWalletValue +=
                (lastPrice as unknown as number) * transaction.quantity;
              console.log("publicWalletValue achat", publicWalletValue);
            });
        } else if (transaction.isSellOrder === true) {
          //if the transaction is a sell then get last price of the stock and subtract the amount from the publicWalletValue
          publicWalletValue -=
            Number(transaction.valueAtExecution) * transaction.quantity;
          console.log("publicWalletValue vente", publicWalletValue);
        } */
      }
    });
    console.log("publicWalletValue final", publicAssetsValue);
  });

  //console.log(wallets);

  return res.status(200).json(wallets);
}

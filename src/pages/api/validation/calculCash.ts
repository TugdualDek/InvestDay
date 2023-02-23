import { apiHandler } from "../../../helpers/api/api-handler";
import type { NextApiRequest, NextApiResponse } from "next";
import { Request } from "../../../types/request.type";
import requestIp from "request-ip";
import walletsService from "../../../services/wallets/wallets.service";
import stocksService from "../../../services/stocks/stocks.service";
import transactionsService from "../../../services/transactions/transactions.service";
import { symbolName } from "typescript";

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
        //check if the transaction could have been executed if there is enough cash
        //check if valueAtExecution is null
        if (transaction.valueAtExecution === null) continue;
        if (transaction.isSellOrder === false) {
          //check if there is enough cash
          if (cash < transaction.valueAtExecution * transaction.quantity) {
            //if not enough cash, set the transaction to rejected
            await transactionsService.updateStatus(
              transaction.id,
              "FAILED",
              true
            );
            console.log("Impossible d'effectuer cette transaction, pas assez d'argent");
            continue;
          }
          cash -= transaction.valueAtExecution * transaction.quantity;
        } else if (transaction.isSellOrder === true) {
          let symbolToCheck = transaction.symbol;

          // check if there is enough quantity to sell by adding transaction.quantity if isSellOrder is false and subtract if isSellOrder is true and remove the quantity of this transaction

          let quantity = 0;

          for (const transaction of wallet.transactions) {
            if (transaction.status === "EXECUTED") {
              if (transaction.symbol === symbolToCheck) {
                if (transaction.isSellOrder === false) {
                  quantity += transaction.quantity;
                } else if (transaction.isSellOrder === true) {
                  quantity -= transaction.quantity;
                }
              }
            }
          }

          quantity += transaction.quantity;

          //console.log("wallet : ", wallet.id, "symbol: " + symbolToCheck, "quantity: " + quantity, "transaction.quantity: " + transaction.quantity);

          if (
            quantity < transaction.quantity
          ) {
            //if not enough quantity, set the transaction to rejected
            await transactionsService.updateStatus(
              transaction.id,
              "FAILED",
              true
            );
            console.log("Impossible d'effectuer cette transaction, pas assez de stock");
            continue;
          }

          cash += transaction.valueAtExecution * transaction.quantity;
        }
      }
      //console.log("wallet : ", wallet.id, "cash: " + cash);
    }
    //update wallet with new cash value
    await walletsService.updateCash(wallet.id, cash);
  }

  return res.status(200).json({ message: "Cash calculated" });
}

import { apiHandler } from "../../../../helpers/api/api-handler";
import type { NextApiRequest, NextApiResponse } from "next";
import { Request } from "../../../../types/request.type";
import requestIp from "request-ip";
import walletsService from "../../../../services/wallets/wallets.service";
import stocksService from "../../../../services/stocks/stocks.service";
import transactionsService from "../../../../services/transactions/transactions.service";
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

  const wallets = await walletsService.getAllWallets(false);
  for (const wallet of wallets) {
    // get all the transactions of the wallet ordered by execution date

    const transactions = await transactionsService.findAll(
      wallet.id.toString(),
      true
    );

    let calculatedWallet: {
      cash: number;
      stocks: { [key: string]: number };
    } = {
      cash: 10000,
      stocks: {},
    };
    for (const transaction of transactions) {
      if (transaction.valueAtExecution) {
        if (!transaction.isSellOrder) {
          if (
            calculatedWallet.cash <
              transaction.valueAtExecution * transaction.quantity ||
            transaction.symbol === "FTPAW" ||
            transaction.symbol === "VAL.WS"
          ) {
            await transactionsService.updateStatus(transaction.id, "FAILED");
            console.log("Pas assez d'argent OU Warrants");
          } else {
            calculatedWallet.cash -=
              transaction.valueAtExecution * transaction.quantity;
            if (calculatedWallet.stocks[transaction.symbol] !== undefined) {
              calculatedWallet.stocks[transaction.symbol] +=
                transaction.quantity;
            } else {
              calculatedWallet.stocks[transaction.symbol] =
                transaction.quantity;
            }
            await transactionsService.updateStatus(transaction.id, "EXECUTED");
          }
        } else {
          if (
            !calculatedWallet.stocks[transaction.symbol] ||
            calculatedWallet.stocks[transaction.symbol] < transaction.quantity
          ) {
            await transactionsService.updateStatus(transaction.id, "FAILED");
            console.log("Pas assez de stock");
          } else {
            calculatedWallet.cash +=
              transaction.valueAtExecution * transaction.quantity;
            calculatedWallet.stocks[transaction.symbol] -= transaction.quantity;
            await transactionsService.updateStatus(transaction.id, "EXECUTED");
          }
        }
      }
    }
    await walletsService.updateCash(wallet.id, calculatedWallet.cash);
  }

  return res.status(200).json({ message: "Wallets calculated" });
}

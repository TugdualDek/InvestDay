import { apiHandler } from "../../../helpers/api/api-handler";
import type { NextApiResponse } from "next";
import requestIp from "request-ip";
import { Request } from "../../../types/request.type";
import { Status } from "@prisma/client";
import stockService from "../../../services/stocks/stocks.service";
import transactionsService from "../../../services/transactions/transactions.service";
import walletsService from "../../../services/wallets/wallets.service";
// listen for get request
export default apiHandler(transactionByWallet);

async function transactionByWallet(req: Request, res: NextApiResponse<any>) {
  //desactivate temporarly this endpoint
  return res.status(200).json({
    message: "This endpoint is temporarly disabled",
  });
  if (req.method !== "POST") {
    throw `Method ${req.method} not allowed`;
  }
  // get wallet
  const { amount, executed, adminPrice, walletId, symbol, selling } = req.body;

  // check if walletId is provided
  if (!walletId) throw "Wallet id is required";

  // on recupere le wallet avec les transactions a l'aide du service

  const wallet = await walletsService.find(walletId, true);

  // Gestion des permissions et des exeptions
  if (!wallet) throw "Wallet not found";
  if (wallet?.userId !== req.auth.sub && !req.auth.isAdmin)
    throw "You are not allowed to access this wallet";
  if (adminPrice && !req.auth.isAdmin)
    throw "You are not allowed to set admin price";
  if (!amount || (!adminPrice && !symbol))
    throw "Please provide amount and stockId or adminPrice";
  if (executed && !req.auth.isAdmin)
    throw "You are not allowed to force execute transaction";

  if (amount <= 0) throw "Amount must be greater than 0";

  if (adminPrice) {
    return res
      .status(200)
      .json(
        await walletsService.addMoney(
          walletId,
          parseFloat(adminPrice) * parseFloat(amount)
        )
      );
  }

  // Get last stock price
  const clientIp = requestIp.getClientIp(req);

  if (!clientIp) throw new Error("No client IP found");
  const summary: any = await stockService.getLastPrice(
    symbol,
    req.auth.sub,
    clientIp || ""
  );
  if (summary?.results[0]?.error == "NOT_FOUND") {
    throw "Unknown symbol";
  }
  let stock = summary.results[0];

  // Crete transaction PENDING
  const transaction = await transactionsService.create(
    selling === "true",
    symbol,
    Number(parseFloat(amount).toFixed(1)),
    wallet.id
  );

  // Executed only if has money, market is open
  console.log("New transaction", transaction);
  if (stock.market_status !== "closed") {
    if (selling === "true") {
      let quantity = 0;
      wallet.transactions.forEach((transaction: any) => {
        if (transaction.symbol === symbol) {
          quantity += (transaction.isSellOrder ? -1 : 1) * transaction.quantity;
        }
      });
      if (quantity < parseFloat(amount)) {
        await transactionsService.updateStatus(transaction.id, Status.FAILED);
      } else {
        await transactionsService.executeTransaction(transaction, stock.price);
      }
    } else {
      if (wallet.cash < stock.price * parseFloat(amount)) {
        await transactionsService.updateStatus(transaction.id, Status.FAILED);
      } else {
        await transactionsService.executeTransaction(transaction, stock.price);
      }
    }
  }

  // get new wallet
  const newWallet = await walletsService.find(walletId);

  return res.status(200).json(newWallet);
}

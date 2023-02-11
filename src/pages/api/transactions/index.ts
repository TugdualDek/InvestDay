import { apiHandler } from "../../../helpers/api/api-handler";
import type { NextApiResponse } from "next";
import { Request } from "../../../types/request.type";
import { PrismaClient, Status, Wallet } from "@prisma/client";
import stockService from "../../../services/stocks/stocks.service";
// listen for get request
export default apiHandler(transactionByWallet);

async function transactionByWallet(req: Request, res: NextApiResponse<any>) {
  if (req.method !== "POST") {
    throw `Method ${req.method} not allowed`;
  }

  let prisma = new PrismaClient();
  // get wallet
  const { amount, executed, adminPrice, walletId, symbol, selling } = req.body;

  // check if walletId is provided
  if (!walletId) throw "Wallet id is required";

  // on recupere le wallet
  let wallet = await prisma.wallet.findUnique({
    where: {
      id: parseInt(walletId as string),
    },
    include: {
      user: true,
      transactions: true,
    },
  });
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

  if (adminPrice) {
    // add Money to user
    // TODO
    // return Cash value
    return res.status(200).json(0);
  }

  // Get last stock price
  const summary: any = await stockService.getLastPrice(symbol);
  if (summary?.results[0]?.error == "NOT_FOUND") {
    throw "Unknown symbol";
  }

  // Executed only if has money, market is open

  let stock = summary.results[0];

  const transaction = await prisma.transaction.create({
    data: {
      isSellOrder: selling === "true",
      symbol: symbol,
      quantity: parseInt(amount),
      walletId: wallet.id,
      status: Status.PENDING,
    },
  });

  if (stock.market_status !== "closed") {
    if (selling === "true") {
      let quantity = 0;
      wallet.transactions.forEach((transaction) => {
        if (transaction.symbol === symbol) {
          quantity += (transaction.isSellOrder ? -1 : 1) * transaction.quantity;
        }
      });
      if (quantity < parseInt(amount)) {
        // transaction has failed set failed
        prisma.transaction.update({
          where: {
            id: transaction.id,
          },
          data: {
            status: Status.FAILED,
          },
        });
      } else {
        await prisma.transaction.update({
          where: {
            id: transaction.id,
          },
          data: {
            valueAtExecution: stock.price,
            executedAt: new Date(),
            status: Status.EXECUTED,
          },
        });
        await prisma.wallet.update({
          where: {
            id: wallet.id,
          },
          data: {
            cash: wallet.cash + stock.price * parseInt(amount),
          },
          include: {
            transactions: true,
          },
        });
      }
    } else {
      // check if user has enough money
      if (wallet.cash < stock.price * parseInt(amount)) {
        // transaction has failed set failed
        prisma.transaction.update({
          where: {
            id: transaction.id,
          },
          data: {
            status: Status.FAILED,
          },
        });
      } else {
        // transaction has succeeded set executed
        await prisma.transaction.update({
          where: {
            id: transaction.id,
          },
          data: {
            valueAtExecution: stock.price,
            executedAt: new Date(),
            status: Status.EXECUTED,
          },
        });
        await prisma.wallet.update({
          where: {
            id: wallet.id,
          },
          data: {
            cash: wallet.cash - stock.price * parseInt(amount),
          },
        });
      }
    }
  }

  // get new wallet
  const newWallet = await prisma.wallet.findUnique({
    where: {
      id: parseInt(walletId as string),
    },
    include: {
      transactions: true,
    },
  });

  return res.status(200).json(newWallet);
}

import { apiHandler } from "../../../helpers/api/api-handler";
import type { NextApiRequest, NextApiResponse } from "next";
import { Request } from "../../../types/request.type";
// import { PrismaClient } from "@prisma/client";
import { prisma } from "../../../lib/prisma";

import requestIp from "request-ip";
import stocksService from "../../../services/stocks/stocks.service";
//import stocksService from "../../../services/stocks/stocks.service";

// you can use the api now

export default apiHandler(validateTransactions);

async function validateTransactions(req: Request, res: NextApiResponse<any>) {
  if (req.method !== "GET") {
    throw `Method ${req.method} not allowed`;
  }
  if (!req.auth.isAdmin) throw "You are not allowed to log values of wallets";

  // let prisma = new PrismaClient();

  let transactions = await prisma.transaction.findMany({
    where: {
      status: "PENDING",
    },
    orderBy: {
      createdAt: "asc",
    },
    include: {
      wallet: {
        select: {
          id: true,
          cash: true,
          userId: true,
        },
      },
    },
  });

  //console.log(transactions);

  const clientIp = requestIp.getClientIp(req);
  if (!clientIp) throw new Error("No client IP found");

  let pricesFound: {
    [key: string]: number;
  } = {}; // cache of prices found
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

  let walletsRemainingCash: {
    [key: string]: number;
  } = {}; // cache of prices found
  function checkIfWalletHasEnoughCash(transaction: any, price: number) {
    const wallet = transaction.wallet;
    const quantity = transaction.quantity;

    let cash = wallet.cash;
    if (walletsRemainingCash[wallet.id]) {
      cash = walletsRemainingCash[wallet.id];
    }

    if (cash < price * quantity) {
      return false;
    } else {
      walletsRemainingCash[wallet.id] = cash - price * quantity;
      return true;
    }
  }

  for (let i = 0; i < transactions.length; i++) {
    let transaction = transactions[i];

    //check if lastStock.symbol is not undefnied and if it is equal to transaction.symbol
    //if it is equal to transaction.symbol then return
    const price = await getPriceFound(transaction.symbol);

    if (!transaction.isSellOrder) {
      const hasCash = checkIfWalletHasEnoughCash(transaction, price);
      if (hasCash) {
        prisma.transaction.update({
          where: {
            id: transaction.id,
          },
          data: {
            status: "EXECUTED",
            valueAtExecution: price,
            executedAt: new Date(),
          },
        });
      } else {
        prisma.transaction.update({
          where: {
            id: transaction.id,
          },
          data: {
            status: "FAILED",
            valueAtExecution: price,
            executedAt: new Date(),
          },
        });
      }
    } else {
      const hasAction = await prisma.transaction.findMany({
        where: {
          symbol: transaction.symbol,
          walletId: transaction.walletId,
        },
      });
      // caluclate the total quantity of the symbol
      let totalQuantity = 0;
      hasAction.forEach((action) => {
        if (action.isSellOrder) {
          totalQuantity -= action.quantity;
        } else {
          totalQuantity += action.quantity;
        }
      });
      if (totalQuantity >= transaction.quantity) {
        walletsRemainingCash[transaction.wallet.id] =
          (walletsRemainingCash[transaction.wallet.id] ||
            transaction.wallet.cash) +
          price * transaction.quantity;

        prisma.transaction.update({
          where: {
            id: transaction.id,
          },
          data: {
            status: "EXECUTED",
            valueAtExecution: price,
            executedAt: new Date(),
          },
        });
      } else {
        prisma.transaction.update({
          where: {
            id: transaction.id,
          },
          data: {
            valueAtExecution: price,
            status: "FAILED",
            executedAt: new Date(),
          },
        });
      }
    }
  }

  // update all wallet cash
  for (const walletId in walletsRemainingCash) {
    await prisma.wallet.update({
      where: {
        id: parseInt(walletId),
      },
      data: {
        cash: walletsRemainingCash[walletId],
      },
    });
  }

  return res.status(200).json(transactions);
}

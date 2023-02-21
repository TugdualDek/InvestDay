import { apiHandler } from "../../../helpers/api/api-handler";
import type { NextApiRequest, NextApiResponse } from "next";
import { Request } from "../../../types/request.type";
import { PrismaClient, Status } from "@prisma/client";
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
  if (!req.auth.isAdmin) throw "You are not allowed to force transactions";

  //   let prisma = new PrismaClient();

  const transactions = await prisma.transaction.findMany({
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

  transactions.forEach(async (transaction) => {
    //check if lastStock.symbol is not undefnied and if it is equal to transaction.symbol
    //if it is equal to transaction.symbol then return

    if (!transaction.isSellOrder) {
      //wallet :
      console.log("transaction", transaction);
      const wallet = await prisma.wallet.findUnique({
        where: {
          id: transaction.wallet.id,
        },
      });
      console.log("wallet", wallet);
      if (!wallet) throw new Error("Wallet not found");

      const price: any = await stocksService.getLastPrice(
        transaction.symbol,
        req.auth.sub,
        clientIp as string
      );
      console.log("price", price);
      console.log(
        "newcash",
        wallet.cash + price.results[0].price * transaction.quantity
      );
      const newWallet = await prisma.wallet.update({
        where: {
          id:
            typeof transaction.wallet.id == "string"
              ? parseInt(transaction.wallet.id)
              : transaction.wallet.id,
        },
        data: {
          cash: wallet.cash + price.results[0].price * transaction.quantity,
        },
      });

      console.log("newWallet", newWallet);
      const newtransactio = await prisma.transaction.update({
        where: {
          id: transaction.id,
        },
        data: {
          status: "EXECUTED",
          valueAtExecution: price.results[0].price,
          executedAt: new Date(),
        },
      });
      console.log("newtransactio", newtransactio);
    }
  });

  return res.status(200).json(transactions);
}

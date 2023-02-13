import { apiHandler } from "../../../helpers/api/api-handler";
import type { NextApiRequest, NextApiResponse } from "next";
import { Request } from "../../../types/request.type";
import { PrismaClient } from "@prisma/client";
import requestIp from "request-ip";
import stockService from "../../../services/stocks/stocks.service";
//import stocksService from "../../../services/stocks/stocks.service";

// you can use the api now

export default apiHandler(validateTransactions);

async function validateTransactions(req: Request, res: NextApiResponse<any>) {
  if (req.method !== "GET") {
    throw `Method ${req.method} not allowed`;
  }

  let prisma = new PrismaClient();

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
          userId: true,
        },
      },
    },
  });

  //console.log(transactions);

  const clientIp = requestIp.getClientIp(req);
  if (!clientIp) throw new Error("No client IP found");
  let lastStock;

  transactions.forEach(async (transaction) => {
    //check if lastStock.symbol is not undefnied and if it is equal to transaction.symbol
    //if it is equal to transaction.symbol then return
    if (lastStock?.symbol && lastStock.symbol == transaction.symbol) return;

    const summary: any = await stockService.getLastPrice(
      transaction.symbol,
      req.auth.sub,
      clientIp
    );
    if (summary?.results[0]?.error == "NOT_FOUND") {
      throw "Unknown symbol";
    }
    let stock = summary.results[0];
    lastStock = stock;
    //console.log(stock);

    let walletId = transaction.walletId;
    //check if user has some cash in his wallet
    let wallet = await prisma.wallet.findUnique({
      where: {
        id: walletId,
      },
    });

    //console.log(wallet["cash"]);
    if(wallet["cash"] == 0) {
      throw "You don't have enough cash in your wallet !";
    } else {
      //update transaction status to "EXECUTED"
      let price = stock.price;
      console.log(price);
      let transactionUpdated = await prisma.transaction.update({
        where: {
          id: transaction.id,
        },
        data: {
          status: "EXECUTED",
          valueAtExecution: price,
          executedAt: new Date(),
        },
      });

      console.log(transactionUpdated);

      //update wallet cash
      let walletUpdated = await prisma.wallet.update({
        where: {
          id: walletId,
        },
        data: {
          cash: wallet["cash"] - price * transaction.quantity,
        },
      });

      console.log(walletUpdated);
    }
  });

  return res.status(200).json(transactions);
}

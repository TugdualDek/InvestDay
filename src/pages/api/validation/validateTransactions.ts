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
    if (transaction.symbol == lastStock.symbol) return;

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
    console.log(stock);
  });

  return res.status(200).json(transactions);
}

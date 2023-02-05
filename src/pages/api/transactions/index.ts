import { apiHandler } from "../../../helpers/api/api-handler";
import type { NextApiResponse } from "next";
import { Request } from "../../../types/request.type";
import { PrismaClient } from "@prisma/client";

// listen for get request
export default apiHandler(transactionByWallet);

async function transactionByWallet(req: Request, res: NextApiResponse<any>) {
  if (req.method !== "POST") {
    throw `Method ${req.method} not allowed`;
  }

  let prisma = new PrismaClient();
  // get wallet
  const { amount, executed, stockId, adminPrice, walletId } = req.body;
  if (!walletId) throw "Wallet id is required";

  const wallet = await prisma.wallet.findUnique({
    where: {
      id: parseInt(walletId as string),
    },
    include: {
      user: true,
    },
  });
  if (!wallet) throw "Wallet not found";

  // check if wallet belongs to user
  if (wallet?.userId !== req.auth.sub && !req.auth.isAdmin) {
    throw "You are not allowed to access this wallet";
  }
  if (adminPrice && !req.auth.isAdmin)
    throw "You are not allowed to set admin price";
  if (!amount || (!adminPrice && !stockId))
    throw "Please provide amount and stockId or adminPrice";
  if (executed && !req.auth.isAdmin)
    throw "You are not allowed to force execute transaction";

  // if adminPrice, create stockPrice
  if (adminPrice) {
    const stockPrice = await prisma.pricesAtTime.create({
      data: {
        price: adminPrice,
        isAdmin: true,
      },
    });
    // create transaction
    const transaction = await prisma.transaction.create({
      data: {
        amount,
        walletId: wallet.id,
        stockId: stockPrice.id,
      },
    });
    return res.status(200).json(transaction);
  }

  // check stock exists
  const stock = await prisma.stock.findUnique({
    where: {
      id: parseInt(stockId as string),
    },
  });
  if (!stock) throw "Stock not found";

  // create transaction
  const transaction = await prisma.transaction.create({
    data: {
      amount,
      walletId: wallet.id,
      stockId: stockId,
    },
  });

  // find stock price
  const stockPrice = await prisma.pricesAtTime.findFirst({
    where: {
      stockId: stock.id,
      isAdmin: false,
    },
    orderBy: {
      //   createdAt: "desc",
    },
  });
  if (!stockPrice) {
  }

  return res.status(200).json(transaction);
}

import { apiHandler } from "../../../../helpers/api/api-handler";
import type { NextApiResponse } from "next";
import { Request } from "../../../../types/request.type";
import { PrismaClient } from "@prisma/client";

// listen for get request
export default apiHandler(transactionByWallet);

async function transactionByWallet(req: Request, res: NextApiResponse<any>) {
  if (req.method !== "POST") {
    throw `Method ${req.method} not allowed`;
  }

  let prisma = new PrismaClient();
  // get wallet
  const { walletId } = req.query;
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
  // create transaction
  const { amount, executed } = req.body;
  const transaction = await prisma.transaction.create({
    data: {
      amount: req.body.amount,
      walletId: wallet.id,
    },
  });
  return res.status(200).json(transaction);
}

import { apiHandler } from "../../../helpers/api/api-handler";

import { Request } from "../../../types/request.type";

import type { NextApiRequest, NextApiResponse } from "next";
// import { PrismaClient } from "@prisma/client";
import { prisma } from "../../../lib/prisma";

import getConfig from "next/config";
const { serverRuntimeConfig } = getConfig();

// listen for get request
export default apiHandler(getAll);

async function getAll(req: Request, res: NextApiResponse<any>) {
  if (req.method !== "GET") {
    throw `Method ${req.method} not allowed`;
  }

  // let prisma = new PrismaClient();

  // si l'utilisateur est un admin, on retourne toutes les infos de chaque transactions
  if (req.auth.isAdmin) {
    const wallets = await prisma.wallet.findMany({
      include: {
        user: true,
        transactions: true,
      },
    });
    return res.status(200).json(wallets);
  } else {
    // sinon on retourne seulement la valeur de la transaction a l'execution
    const wallets = await prisma.wallet.findMany({
      where: {
        userId: req.auth.sub,
      },
      //order by createdAt
      orderBy: {
        createdAt: "asc",
      },
      include: {
        transactions: {
          select: {
            createdAt: true,
            isSellOrder: true,
            symbol: true,
            valueAtExecution: true,
            quantity: true,
            status: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });
    return res.status(200).json(wallets);
  }
}

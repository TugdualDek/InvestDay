import { apiHandler } from "../../../helpers/api/api-handler";
import { Request } from "../../../types/request.type";

import type { NextApiRequest, NextApiResponse } from "next";
// import { PrismaClient } from "@prisma/client";
import { prisma } from "../../../lib/prisma";

import getConfig from "next/config";
const { serverRuntimeConfig } = getConfig();

// listen for get request
export default apiHandler(rank);

async function rank(req: Request, res: NextApiResponse<any>) {
  if (req.method !== "GET") {
    throw `Method ${req.method} not allowed`;
  }

  // let prisma = new PrismaClient();

  /*   // check user
  if (req.auth.isAdmin) {
    const wallets = await prisma.wallet.findMany({
      include: {
        user: true,
        transactions: {
          include: {
            priceAtTime: true,
            stock: true,
          },
        },
      },
    });
    // return basic user details and token
    return res.status(200).json(wallets);
  }
  const wallets = await prisma.wallet.findMany({
    where: {
      userId: req.auth.sub,
    },
    include: {
      transactions: {
        include: {
          priceAtTime: true,
        },
      },
    },
  }); */

  //get all wallets with users and order them by publicWalletValue with the highest first and not the admin
  const allWallets = await prisma.wallet.findMany({
    take: 50,
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          isAdmin: true,
        },
      },
    },

    orderBy: {
      publicWalletValue: "desc",
    },
  });

  //check if there is multiple wallets from the same user and keep only the one with the max publicWalletValue
  let i = 0;
  while (i < allWallets.length) {
    let j = i + 1;
    while (j < allWallets.length) {
      if (allWallets[i].userId === allWallets[j].userId) {
        if (allWallets[i].publicWalletValue < allWallets[j].publicWalletValue) {
          allWallets.splice(i, 1);
        } else {
          allWallets.splice(j, 1);
        }
      }
      j++;
    }
    i++;
  }

  // return only the 10 wallets with the highest publicWalletValue
  allWallets.splice(10, allWallets.length - 10);


  return res.status(200).json(allWallets);
}

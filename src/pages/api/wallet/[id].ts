import { apiHandler } from "../../../helpers/api/api-handler";
import jwt from "jsonwebtoken";
import type { NextApiResponse } from "next";
import { Request } from "../../../types/request.type";
import { User } from "../../../types/user.type";
// import { PrismaClient } from "@prisma/client";
import { prisma } from "../../../lib/prisma";

import bcrypt from "bcrypt";
import getConfig from "next/config";

const { serverRuntimeConfig } = getConfig();

// listen for get request
export default apiHandler(walletById);

async function walletById(req: Request, res: NextApiResponse<any>) {
  if (!["GET", "DELETE"].includes(req.method as string)) {
    throw `Method ${req.method} not allowed`;
  }

  // let prisma = new PrismaClient();
  // check user
  const { id } = req.query;

  //si la methode est delete
  if (req.method === "DELETE") {
    // check if user is admin
    if (!req.auth.isAdmin) {
      throw "You are not allowed to delete wallets";
    } // if user is admin, delete wallet
    await prisma.wallet.delete({
      where: {
        id: parseInt(id as string),
      },
    });
    return res.status(200).json({ message: "Wallet deleted" });
  }
  // return wallet infos if user is admin or wallet belongs to user
  const wallet = await prisma.wallet.findUnique({
    where: {
      id: parseInt(id as string),
    },
    include: {
      user: true,
      transactions: true,
    },
  });
  if (req.auth.isAdmin) {
    return res.status(200).json(wallet);
  }

  // check if wallet belongs to user
  if (wallet?.userId !== req.auth.sub) {
    throw "You are not allowed to access this wallet";
  }
  return res.status(200).json(wallet);
}

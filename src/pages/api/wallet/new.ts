import { apiHandler } from "../../../helpers/api/api-handler";
import jwt from "jsonwebtoken";
import { Request } from "../../../types/request.type";

import type { NextApiRequest, NextApiResponse } from "next";
// import { PrismaClient } from "@prisma/client";
import { prisma } from "../../../lib/prisma";

import getConfig from "next/config";
import walletsService from "../../../services/wallets/wallets.service";
const { serverRuntimeConfig } = getConfig();

// listen for get request
export default apiHandler(getAll);

async function getAll(req: Request, res: NextApiResponse<any>) {
  if (req.method !== "GET") {
    throw `Method ${req.method} not allowed`;
  }

  // let prisma = new PrismaClient();
  // on recupere le nombre de portefeuille deja existant par l'utilisateur
  const wallets = await prisma.wallet.findMany({
    where: {
      userId: req.auth.sub,
    },
  });
  if (wallets.length < 4 || req.auth.isAdmin) {
    return res
      .status(200)
      .json(await walletsService.create(req.auth.sub, 10000));
  } else {
    throw "You already have the maximum number of wallets";
  }
}

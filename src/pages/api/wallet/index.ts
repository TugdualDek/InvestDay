import { apiHandler } from "../../../helpers/api/api-handler";
import jwt from "jsonwebtoken";
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import getConfig from "next/config";
const { serverRuntimeConfig } = getConfig();

// listen for get request
export default apiHandler(getAll);

async function getAll(req: NextApiRequest, res: NextApiResponse<any>) {
  if (req.method !== "GET") {
    throw `Method ${req.method} not allowed`;
  }

  let prisma = new PrismaClient();

  // check user
  const wallets = await prisma.wallet.findMany();

  // return basic user details and token
  return res.status(200).json(wallets);
}

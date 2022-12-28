import { apiHandler } from "../../../helpers/api/api-handler";
import jwt from "jsonwebtoken";
import type { NextApiResponse } from "next";
import { Request } from "../../../types/request.type";
import { User } from "../../../types/user.type";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import getConfig from "next/config";

const { serverRuntimeConfig } = getConfig();

// listen for get request
export default apiHandler(userById);

async function userById(req: Request, res: NextApiResponse<any>) {
  if (req.method !== "GET") {
    throw `Method ${req.method} not allowed`;
  }

  let prisma = new PrismaClient();
  // check user
  const { id } = req.query;

  let user: User | null = await prisma.user.findUnique({
    where: {
      id: parseInt(id as string),
    },
    include: {
      wallet: {
        include: {
          transactions: true,
        },
      },
    },
  });
  console.log(user);
  if (!user) throw "User not found";
  // remove password from user
  delete user.password;

  // return user infos
  return res.status(200).json(user);
}

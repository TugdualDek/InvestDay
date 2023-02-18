import { apiHandler } from "../../../helpers/api/api-handler";
import type { NextApiResponse } from "next";
import { Request } from "../../../types/request.type";
import { User } from "../../../types/user.type";
import { PrismaClient } from "@prisma/client";

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

  if (!user) throw "User not found";
  // remove password from user
  delete user.password;

  // return user infos
  return res.status(200).json(user);
}

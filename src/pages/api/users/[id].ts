// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import type { NextApiRequest, NextApiResponse } from "next";
// import prisma from "../../lib/prisma";
import { PrismaClient } from "@prisma/client";

type Data = {
  email: string;
  password: string;
};

// listen for get request
export default async function login(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  let prisma = new PrismaClient();

  if (req.method === "POST") {
  } else if (req.method === "GET") {
    const user = await prisma.user.findUnique({
      where: {
        id: Number(req.query.id),
      },
    });
    if (!user) {
      res.status(404).send({ message: "User not found" });
      return;
    }
    res.json(user);
  } else {
    res.status(405).send({ message: "Only POST and GET requests allowed" });
    return;
  }
}

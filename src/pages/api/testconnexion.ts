// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import type { NextApiRequest, NextApiResponse } from "next";
// import prisma from "../../lib/prisma";
import { PrismaClient } from "@prisma/client";

type Data = {
  email: string;
  password: string;
};

// listen for get request
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  let prisma = new PrismaClient();

  // use prisma to query database
  // get all users

  const users = await prisma.user.findMany();
  if (users) {
    res.status(200).json("OK");
  } else {
    res.status(400).json("KO");
  }
}

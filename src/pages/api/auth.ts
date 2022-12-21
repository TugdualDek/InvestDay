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
  const test = await prisma.user.create({
    data: {
      email: "test@test.com",
      name: "text4@test.com",
      password: "test",
      test: "test",
    },
  });
  console.log(test);
  // get all users

  const users = prisma.user.findMany().then((users) => {
    console.log(users);
  });

  res.status(200).json("users");
}

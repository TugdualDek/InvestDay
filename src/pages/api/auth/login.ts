import { apiHandler } from "../../../helpers/api/api-handler";
import jwt from "jsonwebtoken";
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import getConfig from "next/config";
const { serverRuntimeConfig } = getConfig();

// listen for get request
export default apiHandler(login);

async function login(req: NextApiRequest, res: NextApiResponse<any>) {
  if (req.method !== "POST") {
    throw `Method ${req.method} not allowed`;
  }
  // retrieve user data
  const { email, password } = req.body;
  if (!email || !password) {
    throw "Email and password are required";
  }

  let prisma = new PrismaClient();

  // check user
  const user = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });
  if (!user) throw "Username or password is incorrect";

  // check password
  const pass = await bcrypt.compare(password, user.password);
  if (!pass) {
    throw "Username or password is incorrect";
  }
  const token = jwt.sign(
    { sub: user.id, isAdmin: user.isAdmin },
    serverRuntimeConfig.secret || "secret",
    {
      expiresIn: "7d",
    }
  );

  // return basic user details and token
  return res.status(200).json({
    id: user.id,
    username: user.name,
    email: user.email,
    studentId: user.studentId,
    admin: user.isAdmin,
    token,
  });
}

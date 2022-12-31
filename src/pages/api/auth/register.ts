import { apiHandler } from "../../../helpers/api/api-handler";
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import transactions from "../../../services/transactions/transactions.service";
import bcrypt from "bcrypt";
type Data = {
  email: string;
  password: string;
  studentId: string;
};

export default apiHandler(register);

async function register(req: NextApiRequest, res: NextApiResponse<any>) {
  if (req.method !== "POST") {
    throw `Method ${req.method} not allowed`;
  }
  let prisma = new PrismaClient();
  // check user data

  const { email, password, studentId } = req.body;
  if (!email || !password) {
    throw "Email and password are required";
    return;
  }
  // check if user already exists (email or isepNumber)
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        {
          email: email,
        },
        {
          studentId: studentId,
        },
      ],
    },
  });

  if (user) {
    throw "Email or isep number already exists";
  }

  const pass = await bcrypt.hash(password, 10);
  // create user
  const newUser = await prisma.user.create({
    data: {
      email: email,
      name: "",
      password: pass,
      studentId: studentId,
    },
  });
  if (!newUser) {
    throw "Erreur lors de la création de l'utilisateur";
  }
  const response = {
    status: "success",
    response: "Utilisateur créé avec succès",
  };

  // create wallet
  const newWallet = await prisma.wallet.create({
    data: {
      userId: newUser.id,
    },
  });
  if (!newWallet) {
    throw "Erreur lors de la création du portefeuille";
  }
  transactions.createAdmin(newWallet.id.toString(), 10000);
  res.status(200).json(response);
}
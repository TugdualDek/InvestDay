import { apiHandler } from "../../../helpers/api/api-handler";
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import transactionsService from "../../../services/transactions/transactions.service";
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

  const { email, password, studentId, name } = req.body;
  if (!email || !password) {
    throw "Email and password are required";
  }
  if (password.length < 8) throw "Password must be at least 8 characters long";
  if (!(email.includes("@isep.fr") || email.includes("@eleve.isep.fr")))
    throw "Please use your isep email";

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
      name: name ? name : "",
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
      cash: 10000,
    },
  });
  if (!newWallet) {
    throw "Erreur lors de la création du portefeuille";
  }
  res.status(200).json(response);
}

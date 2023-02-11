import { Wallet, User, Transaction } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
async function create(userId: number, balance: number): Promise<Wallet> {
  let prisma = new PrismaClient();
  return await prisma.wallet.create({
    data: {
      userId: userId,
      cash: balance,
    },
  });
}
async function find(
  id: string,
  includeUser: boolean = false
): Promise<(Wallet & { transactions: Transaction[]; user?: User }) | null> {
  let prisma = new PrismaClient();
  return await prisma.wallet.findUnique({
    where: { id: parseInt(id) },
    include: {
      transactions: true,
      user: includeUser,
    },
  });
}

async function addMoney(id: string | number, amount: number): Promise<Wallet> {
  let prisma = new PrismaClient();
  return await prisma.wallet.update({
    where: { id: typeof id == "string" ? parseInt(id) : id },
    data: {
      cash: {
        increment: amount,
      },
    },
    include: {
      transactions: true,
    },
  });
}

export default { find, addMoney, create };

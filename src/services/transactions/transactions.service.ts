import { Transaction } from "@prisma/client";
import { PrismaClient } from "@prisma/client";

async function find(id: string): Promise<Transaction | null> {
  let prisma = new PrismaClient();
  return await prisma.transaction.findUnique({
    where: { id: parseInt(id) },
  });
}
async function findAll(walletId: string): Promise<Transaction[]> {
  let prisma = new PrismaClient();
  return await prisma.transaction.findMany({
    where: { walletId: parseInt(walletId) },
  });
}
async function create(
  walletId: string,
  stockId: string,
  amount: number
): Promise<boolean> {
  let prisma = new PrismaClient();
  // Create transaction
  const transaction = await prisma.transaction.create({
    data: {
      walletId: parseInt(walletId),
      stockId: parseInt(stockId),
      amount: amount,
    },
  });
  // find stock price
  //

  return true;
}
async function createAdmin(walletId: string, amount: number): Promise<boolean> {
  let prisma = new PrismaClient();
  // create pricesAtTime admin
  const priceAtTime = await prisma.pricesAtTime.create({
    data: {
      price: amount,
      isAdmin: true,
    },
  });

  // Create transaction
  const transaction = await prisma.transaction.create({
    data: {
      walletId: parseInt(walletId),

      amount: 1,
      priceAtTimeId: priceAtTime.id,
      executedAt: new Date(),
    },
  });
  return true;
}

export default { find, findAll, create, createAdmin };

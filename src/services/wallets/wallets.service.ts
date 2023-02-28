import { Wallet, User, Transaction, History } from "@prisma/client";
// import { PrismaClient } from "@prisma/client";
import { prisma } from "../../lib/prisma";

async function create(userId: number, balance: number): Promise<Wallet> {
  // let prisma = new PrismaClient();
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
  // let prisma = new PrismaClient();
  const wallet = await prisma.wallet.findUnique({
    where: { id: parseInt(id) },
    include: {
      transactions: {
        orderBy: {
          executedAt: "desc",
        },
      },
      user: includeUser,
    },
  });
  if (!wallet) throw "Wallet not found";
  return wallet;
}

async function addMoney(id: string | number, amount: number): Promise<Wallet> {
  // let prisma = new PrismaClient();
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

//create a function to update the publicValue of each wallet
async function updatePublicValue(
  id: string | number,
  amount: number
): Promise<Wallet> {
  // let prisma = new PrismaClient();
  return await prisma.wallet.update({
    where: { id: typeof id == "string" ? parseInt(id) : id },
    data: {
      publicWalletValue: amount,
      datePublicUpdated: new Date(),
    },
  });
}

//create a function to log the daily value of each wallet in the history table
async function logWalletValue(
  id: string | number,
  amount: number
): Promise<History> {
  // let prisma = new PrismaClient();
  return await prisma.history.create({
    data: {
      walletId: typeof id == "string" ? parseInt(id) : id,
      walletValue: amount,
    },
  });
}

//function to get all wallets and their transactions
async function getAllWallets(
  withTransactions: boolean = true
): Promise<(Wallet & { transactions: Transaction[] })[]> {
  // let prisma = new PrismaClient();
  return await prisma.wallet.findMany({
    include: {
      transactions: withTransactions,
    },
  });
}

// update cash of a wallet
async function updateCash(
  id: string | number,
  amount: number
): Promise<Wallet> {
  // let prisma = new PrismaClient();
  return await prisma.wallet.update({
    where: { id: typeof id == "string" ? parseInt(id) : id },
    data: {
      cash: amount,
    },
  });
}

const walletsService = {
  find,
  addMoney,
  create,
  getAllWallets,
  updatePublicValue,
  logWalletValue,
  updateCash,
};
export default walletsService;

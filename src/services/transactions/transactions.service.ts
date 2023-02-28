import { Transaction, Wallet } from "@prisma/client";
import { Status } from "@prisma/client";
import walletsService from "../wallets/wallets.service";
import { prisma } from "../../lib/prisma";
async function find(id: string): Promise<Transaction | null> {
  return await prisma.transaction.findUnique({
    where: { id: parseInt(id) },
  });
}
async function findAll(
  walletId: string,
  byExecution: boolean = false
): Promise<Transaction[]> {
  if (!byExecution) {
    return await prisma.transaction.findMany({
      where: { walletId: parseInt(walletId) },
      orderBy: { createdAt: "desc" },
    });
  } else {
    return await prisma.transaction.findMany({
      where: { walletId: parseInt(walletId) },
      orderBy: { executedAt: "asc" },
    });
  }
}

async function create(
  isSellOrder: boolean,
  symbol: string,
  quantity: number,
  walletId: number
): Promise<Transaction> {
  // Create transaction
  const transaction = await prisma.transaction.create({
    data: {
      isSellOrder: isSellOrder,
      symbol: symbol,
      quantity: quantity,
      walletId: walletId,
      status: Status.PENDING,
    },
  });
  return transaction;
}

async function updateStatus(
  transactionId: number,
  newStatus: Status,
  fail: boolean = false
) {
  console.log("updateStatus", newStatus);

  return await prisma.transaction.update({
    where: {
      id: transactionId,
    },
    data: {
      status: newStatus,
    },
  });
}
async function executeTransaction(
  transaction: Transaction,
  stockPrice: number
) {
  const newTransaction = await prisma.transaction.update({
    where: {
      id: transaction.id,
    },
    data: {
      valueAtExecution: stockPrice,
      executedAt: new Date(),
      status: Status.EXECUTED,
    },
  });

  await walletsService.addMoney(
    transaction.walletId,
    stockPrice * transaction.quantity * (transaction.isSellOrder ? 1 : -1)
  );
}
const transactionsService = {
  find,
  findAll,
  create,
  updateStatus,
  executeTransaction,
};
export default transactionsService;

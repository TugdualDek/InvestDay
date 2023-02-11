import { Transaction, Wallet } from "@prisma/client";
import { PrismaClient, Status } from "@prisma/client";
import walletsService from "../wallets/wallets.service";
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
  isSellOrder: boolean,
  symbol: string,
  quantity: number,
  walletId: number
): Promise<Transaction> {
  let prisma = new PrismaClient();
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

async function updateStatus(transactionId: number, newStatus: Status) {
  let prisma = new PrismaClient();
  await prisma.transaction.update({
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
  let prisma = new PrismaClient();
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
export default { find, findAll, create, updateStatus, executeTransaction };

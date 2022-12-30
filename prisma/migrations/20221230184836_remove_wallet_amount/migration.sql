/*
  Warnings:

  - You are about to drop the column `amount` on the `Transaction` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "pricesAtTime" DROP CONSTRAINT "pricesAtTime_stockId_fkey";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "amount";

-- AlterTable
ALTER TABLE "pricesAtTime" ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "timestamp" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "stockId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "pricesAtTime" ADD CONSTRAINT "pricesAtTime_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "Stock"("id") ON DELETE SET NULL ON UPDATE CASCADE;

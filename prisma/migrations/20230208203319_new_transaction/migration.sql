/*
  Warnings:

  - You are about to drop the column `amount` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `executed` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `priceAtSoldTimeId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `priceAtTimeId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `soldAt` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `stockId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the `Stock` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `pricesAtTime` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `isSellOrder` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantity` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `symbol` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `valueAtExecution` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'EXECUTED', 'CANCELLED', 'FAILED');

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_priceAtSoldTimeId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_priceAtTimeId_fkey";

-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_stockId_fkey";

-- DropForeignKey
ALTER TABLE "pricesAtTime" DROP CONSTRAINT "pricesAtTime_stockId_fkey";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "amount",
DROP COLUMN "executed",
DROP COLUMN "priceAtSoldTimeId",
DROP COLUMN "priceAtTimeId",
DROP COLUMN "soldAt",
DROP COLUMN "stockId",
ADD COLUMN     "isAdmin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isSellOrder" BOOLEAN NOT NULL,
ADD COLUMN     "quantity" INTEGER NOT NULL,
ADD COLUMN     "status" "Status" NOT NULL,
ADD COLUMN     "symbol" TEXT NOT NULL,
ADD COLUMN     "valueAtExecution" DOUBLE PRECISION NOT NULL;

-- DropTable
DROP TABLE "Stock";

-- DropTable
DROP TABLE "pricesAtTime";

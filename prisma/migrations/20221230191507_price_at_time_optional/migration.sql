-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_priceAtTimeId_fkey";

-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "priceAtTimeId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_priceAtTimeId_fkey" FOREIGN KEY ("priceAtTimeId") REFERENCES "pricesAtTime"("id") ON DELETE SET NULL ON UPDATE CASCADE;

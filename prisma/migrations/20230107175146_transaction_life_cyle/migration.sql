-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "priceAtSoldTimeId" INTEGER,
ADD COLUMN     "soldAt" TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_priceAtSoldTimeId_fkey" FOREIGN KEY ("priceAtSoldTimeId") REFERENCES "pricesAtTime"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "Stock"("id") ON DELETE SET NULL ON UPDATE CASCADE;

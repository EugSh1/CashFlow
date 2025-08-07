/*
  Warnings:

  - You are about to drop the `TransactionToTag` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `walletId` to the `Tag` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tag" ADD COLUMN     "walletId" TEXT NOT NULL;

-- DropTable
DROP TABLE "TransactionToTag";

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

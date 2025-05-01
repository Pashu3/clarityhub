/*
  Warnings:

  - The `plan` column on the `Subscription` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[userId,date]` on the table `UploadLimit` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ipAddress,date]` on the table `UploadLimit` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "UploadLimit_ipAddress_date_idx";

-- DropIndex
DROP INDEX "UploadLimit_userId_date_idx";

-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "plan",
ADD COLUMN     "plan" TEXT NOT NULL DEFAULT 'FREE';

-- AlterTable
ALTER TABLE "UploadLimit" ALTER COLUMN "date" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "count" SET DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "UploadLimit_userId_date_key" ON "UploadLimit"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "UploadLimit_ipAddress_date_key" ON "UploadLimit"("ipAddress", "date");

/*
  Warnings:

  - You are about to drop the `Subscription` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UploadLimit` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_userId_fkey";

-- DropForeignKey
ALTER TABLE "UploadLimit" DROP CONSTRAINT "UploadLimit_userId_fkey";

-- DropTable
DROP TABLE "Subscription";

-- DropTable
DROP TABLE "UploadLimit";

-- DropEnum
DROP TYPE "Plan";

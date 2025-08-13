/*
  Warnings:

  - You are about to drop the column `backupCodes` on the `DataExport` table. All the data in the column will be lost.
  - You are about to drop the column `mfaEnabled` on the `DataExport` table. All the data in the column will be lost.
  - You are about to drop the column `mfaSecret` on the `DataExport` table. All the data in the column will be lost.
  - You are about to drop the column `mfaVerified` on the `DataExport` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DataExport" DROP COLUMN "backupCodes",
DROP COLUMN "mfaEnabled",
DROP COLUMN "mfaSecret",
DROP COLUMN "mfaVerified";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "backupCodes" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "mfaEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "mfaSecret" TEXT,
ADD COLUMN     "mfaVerified" BOOLEAN NOT NULL DEFAULT false;

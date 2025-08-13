-- CreateEnum
CREATE TYPE "DataExportFormat" AS ENUM ('CSV', 'XLSX', 'JSON');

-- CreateEnum
CREATE TYPE "DataType" AS ENUM ('USERS', 'LEADS', 'UPLOADS', 'ANALYTICS', 'INTERACTIONS', 'FULL', 'CUSTOM');

-- CreateEnum
CREATE TYPE "DataOperationStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'COMPLETED_WITH_ERRORS');

-- CreateEnum
CREATE TYPE "BackupType" AS ENUM ('FULL', 'PARTIAL', 'DIFFERENTIAL');

-- CreateTable
CREATE TABLE "DataExport" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dataType" "DataType" NOT NULL,
    "format" "DataExportFormat" NOT NULL,
    "recordCount" INTEGER,
    "fileSize" INTEGER,
    "filePath" TEXT,
    "status" "DataOperationStatus" NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DataExport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataImport" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dataType" "DataType" NOT NULL,
    "format" "DataExportFormat" NOT NULL,
    "filePath" TEXT NOT NULL,
    "recordCount" INTEGER,
    "fileSize" INTEGER,
    "status" "DataOperationStatus" NOT NULL,
    "successCount" INTEGER,
    "failedCount" INTEGER,
    "validationLog" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DataImport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DataBackup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "BackupType" NOT NULL,
    "fileSize" INTEGER,
    "filePath" TEXT,
    "status" "DataOperationStatus" NOT NULL,
    "duration" INTEGER,
    "retention" INTEGER NOT NULL,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DataBackup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "data_settings" (
    "id" TEXT NOT NULL,
    "backupFrequency" TEXT NOT NULL DEFAULT 'DAILY',
    "backupTime" TEXT NOT NULL DEFAULT '00:00',
    "backupRetention" INTEGER NOT NULL DEFAULT 7,
    "backupStorage" TEXT NOT NULL DEFAULT 'LOCAL',
    "maxExportSize" INTEGER NOT NULL DEFAULT 50,
    "exportRetention" INTEGER NOT NULL DEFAULT 24,
    "importValidation" BOOLEAN NOT NULL DEFAULT true,
    "importRollback" BOOLEAN NOT NULL DEFAULT true,
    "activityLogsRetention" INTEGER NOT NULL DEFAULT 30,
    "deletedDataRetention" INTEGER NOT NULL DEFAULT 7,
    "autoPurgeData" BOOLEAN NOT NULL DEFAULT false,
    "analyticsRetention" INTEGER NOT NULL DEFAULT 180,
    "connectionPoolSize" INTEGER NOT NULL DEFAULT 25,
    "queryTimeout" INTEGER NOT NULL DEFAULT 10,
    "queryLogging" BOOLEAN NOT NULL DEFAULT true,
    "maintenanceWindow" TEXT NOT NULL DEFAULT 'SUN,01:00-03:00',
    "dataEncryption" BOOLEAN NOT NULL DEFAULT true,
    "dataAnonymization" BOOLEAN NOT NULL DEFAULT false,
    "dataAccessAuditing" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "data_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DataExport_userId_idx" ON "DataExport"("userId");

-- CreateIndex
CREATE INDEX "DataExport_createdAt_idx" ON "DataExport"("createdAt");

-- CreateIndex
CREATE INDEX "DataExport_status_idx" ON "DataExport"("status");

-- CreateIndex
CREATE INDEX "DataImport_userId_idx" ON "DataImport"("userId");

-- CreateIndex
CREATE INDEX "DataImport_createdAt_idx" ON "DataImport"("createdAt");

-- CreateIndex
CREATE INDEX "DataImport_status_idx" ON "DataImport"("status");

-- CreateIndex
CREATE INDEX "DataBackup_userId_idx" ON "DataBackup"("userId");

-- CreateIndex
CREATE INDEX "DataBackup_createdAt_idx" ON "DataBackup"("createdAt");

-- CreateIndex
CREATE INDEX "DataBackup_status_idx" ON "DataBackup"("status");

-- CreateIndex
CREATE INDEX "LeadInteraction_createdBy_idx" ON "LeadInteraction"("createdBy");

-- AddForeignKey
ALTER TABLE "LeadInteraction" ADD CONSTRAINT "LeadInteraction_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataExport" ADD CONSTRAINT "DataExport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataImport" ADD CONSTRAINT "DataImport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DataBackup" ADD CONSTRAINT "DataBackup_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

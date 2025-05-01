-- CreateTable
CREATE TABLE "CsvRow" (
    "id" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "fileId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CsvRow_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CsvRow" ADD CONSTRAINT "CsvRow_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "Upload"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "AIQuery" (
    "id" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,
    "userId" TEXT,
    "question" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AIQuery_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AIQuery" ADD CONSTRAINT "AIQuery_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "Upload"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIQuery" ADD CONSTRAINT "AIQuery_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "Upload" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "SharedChat" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "previewText" TEXT NOT NULL,
    "aiQueryId" TEXT NOT NULL,
    "isBookmarked" BOOLEAN NOT NULL DEFAULT false,
    "isNew" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sharedBy" TEXT NOT NULL,

    CONSTRAINT "SharedChat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SharedChatUser" (
    "id" TEXT NOT NULL,
    "sharedChatId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SharedChatUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SharedChat_aiQueryId_key" ON "SharedChat"("aiQueryId");

-- CreateIndex
CREATE INDEX "SharedChatUser_userId_idx" ON "SharedChatUser"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SharedChatUser_sharedChatId_userId_key" ON "SharedChatUser"("sharedChatId", "userId");

-- CreateIndex
CREATE INDEX "Upload_guestId_idx" ON "Upload"("guestId");

-- AddForeignKey
ALTER TABLE "SharedChat" ADD CONSTRAINT "SharedChat_aiQueryId_fkey" FOREIGN KEY ("aiQueryId") REFERENCES "AIQuery"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SharedChatUser" ADD CONSTRAINT "SharedChatUser_sharedChatId_fkey" FOREIGN KEY ("sharedChatId") REFERENCES "SharedChat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

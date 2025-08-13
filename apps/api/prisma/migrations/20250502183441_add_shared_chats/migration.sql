-- AddForeignKey
ALTER TABLE "SharedChatUser" ADD CONSTRAINT "SharedChatUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

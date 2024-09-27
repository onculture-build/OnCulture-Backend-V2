/*
  Warnings:

  - A unique constraint covering the columns `[userId,email]` on the table `user_email` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,phone]` on the table `user_phone` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "user_email_userId_email_key" ON "user_email"("userId", "email");

-- CreateIndex
CREATE UNIQUE INDEX "user_phone_userId_phone_key" ON "user_phone"("userId", "phone");

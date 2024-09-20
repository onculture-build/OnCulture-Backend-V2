/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `base_user` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "base_user_email_key" ON "base_user"("email");

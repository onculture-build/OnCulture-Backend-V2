/*
  Warnings:

  - A unique constraint covering the columns `[userId,companyId]` on the table `base_user_company` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "base_user_email_key";

-- CreateIndex
CREATE UNIQUE INDEX "base_user_company_userId_companyId_key" ON "base_user_company"("userId", "companyId");

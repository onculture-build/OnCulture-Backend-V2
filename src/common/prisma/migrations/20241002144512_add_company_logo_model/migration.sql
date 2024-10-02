/*
  Warnings:

  - You are about to drop the column `logo` on the `base_company` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "base_company" DROP COLUMN "logo",
ADD COLUMN     "logoId" VARCHAR;

-- CreateTable
CREATE TABLE "base_company_logo" (
    "id" UUID NOT NULL,
    "companyCode" TEXT NOT NULL,
    "key" VARCHAR(255) NOT NULL,
    "eTag" VARCHAR(255) NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "base_company_logo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "base_company_logo_companyCode_key" ON "base_company_logo"("companyCode");

-- AddForeignKey
ALTER TABLE "base_company_logo" ADD CONSTRAINT "base_company_logo_companyCode_fkey" FOREIGN KEY ("companyCode") REFERENCES "base_company"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

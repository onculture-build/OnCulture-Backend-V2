/*
  Warnings:

  - You are about to drop the column `fractionPart` on the `company_country` table. All the data in the column will be lost.
  - You are about to drop the column `perUserPrice` on the `company_country` table. All the data in the column will be lost.
  - You are about to drop the column `wholePart` on the `company_country` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "company_country" DROP COLUMN "fractionPart",
DROP COLUMN "perUserPrice",
DROP COLUMN "wholePart";

-- AlterTable
ALTER TABLE "company_user" ADD COLUMN     "countryId" UUID,
ADD COLUMN     "stateId" UUID;

-- AddForeignKey
ALTER TABLE "company_user" ADD CONSTRAINT "company_user_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "company_state"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_user" ADD CONSTRAINT "company_user_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "company_country"("id") ON DELETE SET NULL ON UPDATE CASCADE;

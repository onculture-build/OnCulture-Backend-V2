-- DropForeignKey
ALTER TABLE "company_user" DROP CONSTRAINT "company_user_countryId_fkey";

-- DropForeignKey
ALTER TABLE "company_user" DROP CONSTRAINT "company_user_stateId_fkey";

-- AlterTable
ALTER TABLE "company_country" ADD COLUMN     "fractionPart" VARCHAR(20),
ADD COLUMN     "perUserPrice" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
ADD COLUMN     "wholePart" VARCHAR(20);

-- AddForeignKey
ALTER TABLE "company_user" ADD CONSTRAINT "company_user_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "company_state"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "company_user" ADD CONSTRAINT "company_user_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "company_country"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

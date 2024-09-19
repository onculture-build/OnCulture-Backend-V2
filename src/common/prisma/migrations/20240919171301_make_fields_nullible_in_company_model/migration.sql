-- DropForeignKey
ALTER TABLE "base_company" DROP CONSTRAINT "base_company_countryId_fkey";

-- DropForeignKey
ALTER TABLE "base_company" DROP CONSTRAINT "base_company_stateId_fkey";

-- AlterTable
ALTER TABLE "base_company" ALTER COLUMN "phone" DROP NOT NULL,
ALTER COLUMN "countryId" DROP NOT NULL,
ALTER COLUMN "stateId" DROP NOT NULL,
ALTER COLUMN "address1" DROP NOT NULL;

-- AlterTable
ALTER TABLE "base_company_request" ALTER COLUMN "phone" DROP NOT NULL,
ALTER COLUMN "countryId" DROP NOT NULL,
ALTER COLUMN "stateId" DROP NOT NULL,
ALTER COLUMN "address1" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "base_company" ADD CONSTRAINT "base_company_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "base_country"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "base_company" ADD CONSTRAINT "base_company_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "base_state"("id") ON DELETE SET NULL ON UPDATE CASCADE;

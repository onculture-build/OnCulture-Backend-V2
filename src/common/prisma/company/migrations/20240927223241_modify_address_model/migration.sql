/*
  Warnings:

  - The values [Operational] on the enum `AddressPurpose` will be removed. If these variants are still used in the database, this will fail.
  - The `purpose` column on the `user_address` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[userId,purpose]` on the table `user_address` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AddressPurpose_new" AS ENUM ('Primary', 'Billing', 'Temporary', 'Old');
ALTER TABLE "user_address" ALTER COLUMN "purpose" TYPE "AddressPurpose_new" USING ("purpose"::text::"AddressPurpose_new");
ALTER TYPE "AddressPurpose" RENAME TO "AddressPurpose_old";
ALTER TYPE "AddressPurpose_new" RENAME TO "AddressPurpose";
DROP TYPE "AddressPurpose_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "user_address" DROP CONSTRAINT "user_address_countryId_fkey";

-- DropForeignKey
ALTER TABLE "user_address" DROP CONSTRAINT "user_address_stateId_fkey";

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "address" TEXT;

-- AlterTable
ALTER TABLE "user_address" ALTER COLUMN "stateId" DROP NOT NULL,
ALTER COLUMN "countryId" DROP NOT NULL,
DROP COLUMN "purpose",
ADD COLUMN     "purpose" "AddressPurpose" DEFAULT 'Primary';

-- CreateIndex
CREATE UNIQUE INDEX "user_address_userId_purpose_key" ON "user_address"("userId", "purpose");

-- AddForeignKey
ALTER TABLE "user_address" ADD CONSTRAINT "user_address_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "country"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_address" ADD CONSTRAINT "user_address_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "state"("id") ON DELETE SET NULL ON UPDATE CASCADE;

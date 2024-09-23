/*
  Warnings:

  - The `values` column on the `base_company_request` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "base_company_request" DROP COLUMN "values",
ADD COLUMN     "values" JSONB;

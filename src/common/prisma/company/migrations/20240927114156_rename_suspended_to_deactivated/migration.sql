/*
  Warnings:

  - The values [Suspended] on the enum `EmployeeStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EmployeeStatus_new" AS ENUM ('Active', 'Inactive', 'Deactivated');
ALTER TABLE "employee" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "employee" ALTER COLUMN "status" TYPE "EmployeeStatus_new" USING ("status"::text::"EmployeeStatus_new");
ALTER TYPE "EmployeeStatus" RENAME TO "EmployeeStatus_old";
ALTER TYPE "EmployeeStatus_new" RENAME TO "EmployeeStatus";
DROP TYPE "EmployeeStatus_old";
ALTER TABLE "employee" ALTER COLUMN "status" SET DEFAULT 'Active';
COMMIT;

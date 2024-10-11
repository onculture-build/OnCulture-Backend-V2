/*
  Warnings:

  - You are about to drop the column `levelId` on the `job_role` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "job_role_levelId_key";

-- AlterTable
ALTER TABLE "job_role" DROP COLUMN "levelId";

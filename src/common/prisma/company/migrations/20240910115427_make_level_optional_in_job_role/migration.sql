-- DropForeignKey
ALTER TABLE "job_role" DROP CONSTRAINT "job_role_levelId_fkey";

-- AlterTable
ALTER TABLE "job_role" ALTER COLUMN "levelId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "job_role" ADD CONSTRAINT "job_role_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "job_level"("id") ON DELETE SET NULL ON UPDATE CASCADE;

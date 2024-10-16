/*
  Warnings:

  - The `status` column on the `employee_course_progress` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `progress` on the `employee_course_progress` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "course_subscription" ADD COLUMN     "isSanityCourse" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "employee_course_progress" DROP COLUMN "progress",
ADD COLUMN     "progress" JSONB NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" BOOLEAN NOT NULL DEFAULT true;

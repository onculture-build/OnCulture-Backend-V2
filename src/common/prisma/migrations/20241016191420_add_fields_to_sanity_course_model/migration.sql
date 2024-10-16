/*
  Warnings:

  - You are about to drop the column `santityId` on the `sanity_course` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[sanityId]` on the table `sanity_course` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sanityId` to the `sanity_course` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "sanity_course_santityId_key";

-- AlterTable
ALTER TABLE "sanity_course" DROP COLUMN "santityId",
ADD COLUMN     "author" VARCHAR,
ADD COLUMN     "modules" JSONB,
ADD COLUMN     "sanityId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "sanity_course_sanityId_key" ON "sanity_course"("sanityId");

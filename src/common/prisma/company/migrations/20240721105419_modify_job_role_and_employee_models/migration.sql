/*
  Warnings:

  - A unique constraint covering the columns `[levelId]` on the table `core_job_role` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "core_job_role_levelId_key" ON "core_job_role"("levelId");

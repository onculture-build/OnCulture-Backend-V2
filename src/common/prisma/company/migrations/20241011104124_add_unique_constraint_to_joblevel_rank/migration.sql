/*
  Warnings:

  - A unique constraint covering the columns `[rank]` on the table `job_level` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "job_level_rank_key" ON "job_level"("rank");

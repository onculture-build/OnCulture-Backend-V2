/*
  Warnings:

  - Made the column `code` on table `deparment` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "deparment" ALTER COLUMN "code" SET NOT NULL;

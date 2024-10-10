/*
  Warnings:

  - Added the required column `promotionDate` to the `employee_job_timeline` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "employee_job_timeline" ADD COLUMN     "promotionDate" TIMESTAMPTZ(6) NOT NULL;

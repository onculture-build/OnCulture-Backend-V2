/*
  Warnings:

  - You are about to drop the column `employmentType` on the `employee` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "employee" DROP COLUMN "employmentType",
ADD COLUMN     "employmentTypeId" UUID;

-- DropEnum
DROP TYPE "EmploymentType";

-- CreateTable
CREATE TABLE "employment_type" (
    "id" UUID NOT NULL,
    "title" VARCHAR(50) NOT NULL,
    "description" VARCHAR(255),
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "employment_type_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "employment_type_title_key" ON "employment_type"("title");

-- AddForeignKey
ALTER TABLE "employee" ADD CONSTRAINT "employee_employmentTypeId_fkey" FOREIGN KEY ("employmentTypeId") REFERENCES "employment_type"("id") ON DELETE SET NULL ON UPDATE CASCADE;

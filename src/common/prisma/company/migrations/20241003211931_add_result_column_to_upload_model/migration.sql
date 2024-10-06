/*
  Warnings:

  - You are about to drop the column `errorMessage` on the `file_upload` table. All the data in the column will be lost.
  - You are about to drop the `deparment` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "deparment" DROP CONSTRAINT "deparment_managerId_fkey";

-- DropForeignKey
ALTER TABLE "employee_department" DROP CONSTRAINT "employee_department_departmentId_fkey";

-- AlterTable
ALTER TABLE "file_upload" DROP COLUMN "errorMessage",
ADD COLUMN     "statusMessage" VARCHAR,
ADD COLUMN     "uploadResult" JSONB;

-- DropTable
DROP TABLE "deparment";

-- CreateTable
CREATE TABLE "department" (
    "id" UUID NOT NULL,
    "name" VARCHAR NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "alias" VARCHAR(100),
    "description" VARCHAR(255),
    "managerId" UUID,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "department_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "department_name_key" ON "department"("name");

-- CreateIndex
CREATE UNIQUE INDEX "department_code_key" ON "department"("code");

-- CreateIndex
CREATE UNIQUE INDEX "department_alias_key" ON "department"("alias");

-- AddForeignKey
ALTER TABLE "employee_department" ADD CONSTRAINT "employee_department_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "department"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "department" ADD CONSTRAINT "department_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "department_manager"("id") ON DELETE SET NULL ON UPDATE CASCADE;

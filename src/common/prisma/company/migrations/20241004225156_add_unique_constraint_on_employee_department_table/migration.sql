/*
  Warnings:

  - A unique constraint covering the columns `[employeeId,departmentId]` on the table `employee_department` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "employee_department_employeeId_departmentId_idx";

-- CreateIndex
CREATE UNIQUE INDEX "employee_department_employeeId_departmentId_key" ON "employee_department"("employeeId", "departmentId");

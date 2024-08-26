-- AlterTable
ALTER TABLE "deparment" ADD COLUMN     "managerId" UUID;

-- CreateTable
CREATE TABLE "department_manager" (
    "id" UUID NOT NULL,
    "departmentId" UUID NOT NULL,
    "employeeId" UUID NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "department_manager_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "deparment" ADD CONSTRAINT "deparment_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "department_manager"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "department_manager" ADD CONSTRAINT "department_manager_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- DropForeignKey
ALTER TABLE "job_role" DROP CONSTRAINT "job_role_levelId_fkey";

-- AlterTable
ALTER TABLE "employee" ADD COLUMN     "levelId" UUID;

-- CreateTable
CREATE TABLE "employee_job_timeline" (
    "id" UUID NOT NULL,
    "employeeId" UUID NOT NULL,
    "jobRoleId" UUID NOT NULL,
    "departmentId" UUID NOT NULL,
    "levelId" UUID NOT NULL,
    "employmentTypeId" UUID NOT NULL,
    "managerId" UUID,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "employee_job_timeline_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "employee" ADD CONSTRAINT "employee_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "job_level"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_job_timeline" ADD CONSTRAINT "employee_job_timeline_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "employee_job_timeline" ADD CONSTRAINT "employee_job_timeline_jobRoleId_fkey" FOREIGN KEY ("jobRoleId") REFERENCES "job_role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "employee_job_timeline" ADD CONSTRAINT "employee_job_timeline_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "department"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "employee_job_timeline" ADD CONSTRAINT "employee_job_timeline_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "job_level"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "employee_job_timeline" ADD CONSTRAINT "employee_job_timeline_employmentTypeId_fkey" FOREIGN KEY ("employmentTypeId") REFERENCES "employment_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

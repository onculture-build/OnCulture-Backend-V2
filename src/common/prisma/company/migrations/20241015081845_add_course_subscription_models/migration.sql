-- CreateEnum
CREATE TYPE "CourseSubscriptionStatus" AS ENUM ('Pending', 'InProgress', 'Completed');

-- CreateTable
CREATE TABLE "course_subscription" (
    "id" UUID NOT NULL,
    "courseId" UUID NOT NULL,
    "subscriptionId" UUID NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "course_subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee_course_subscription" (
    "id" UUID NOT NULL,
    "employeeId" UUID NOT NULL,
    "courseSubscriptionId" UUID NOT NULL,
    "status" "CourseSubscriptionStatus" NOT NULL DEFAULT 'Pending',
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "employee_course_subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee_course_progress" (
    "id" UUID NOT NULL,
    "employeeSubscriptionId" UUID NOT NULL,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "status" "CourseSubscriptionStatus" NOT NULL DEFAULT 'Pending',
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "employee_course_progress_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "employee_course_subscription" ADD CONSTRAINT "employee_course_subscription_courseSubscriptionId_fkey" FOREIGN KEY ("courseSubscriptionId") REFERENCES "course_subscription"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "employee_course_subscription" ADD CONSTRAINT "employee_course_subscription_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

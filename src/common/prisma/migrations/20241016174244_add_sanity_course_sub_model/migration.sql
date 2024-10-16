/*
  Warnings:

  - You are about to drop the `sanity_courses` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "sanity_courses";

-- CreateTable
CREATE TABLE "sanity_course" (
    "id" UUID NOT NULL,
    "santityId" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "sanity_course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sanity_course_subscription" (
    "id" UUID NOT NULL,
    "courseId" UUID NOT NULL,
    "companyId" UUID NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "sanity_course_subscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sanity_course_santityId_key" ON "sanity_course"("santityId");

-- CreateIndex
CREATE UNIQUE INDEX "sanity_course_subscription_courseId_companyId_key" ON "sanity_course_subscription"("courseId", "companyId");

-- AddForeignKey
ALTER TABLE "sanity_course_subscription" ADD CONSTRAINT "sanity_course_subscription_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "sanity_course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

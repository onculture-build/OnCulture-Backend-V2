/*
  Warnings:

  - You are about to drop the column `lesson` on the `base_course` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `base_course` table. All the data in the column will be lost.
  - You are about to drop the column `quiz` on the `base_course` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `base_course` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[title]` on the table `base_course` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `title` to the `base_course` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyId` to the `base_package_subscription` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "QuizType" AS ENUM ('MultipleChoice', 'TrueFalse', 'FillInTheBlank');

-- DropIndex
DROP INDEX "base_course_name_key";

-- AlterTable
ALTER TABLE "base_company" ADD COLUMN     "overview" VARCHAR;

-- AlterTable
ALTER TABLE "base_course" DROP COLUMN "lesson",
DROP COLUMN "name",
DROP COLUMN "quiz",
DROP COLUMN "url",
ADD COLUMN     "description" VARCHAR,
ADD COLUMN     "sanityId" VARCHAR,
ADD COLUMN     "title" VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE "base_package_subscription" ADD COLUMN     "companyId" UUID NOT NULL;

-- CreateTable
CREATE TABLE "base_course_module" (
    "id" UUID NOT NULL,
    "courseId" UUID NOT NULL,
    "sanityId" VARCHAR,
    "title" VARCHAR(255) NOT NULL,
    "description" VARCHAR,
    "sequence" INTEGER NOT NULL DEFAULT 0,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "base_course_module_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "module_lesson" (
    "id" UUID NOT NULL,
    "moduleId" UUID NOT NULL,
    "sanityId" VARCHAR,
    "sequence" INTEGER NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "content" JSONB NOT NULL,
    "mediaUrl" VARCHAR,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "module_lesson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "module_quiz" (
    "id" UUID NOT NULL,
    "lessonId" UUID,
    "moduleId" UUID,
    "sanityId" VARCHAR,
    "sequence" INTEGER NOT NULL,
    "question" VARCHAR NOT NULL,
    "mediaUrl" VARCHAR,
    "type" "QuizType" NOT NULL DEFAULT 'MultipleChoice',
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "module_quiz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_options" (
    "id" UUID NOT NULL,
    "quizId" UUID NOT NULL,
    "option" VARCHAR NOT NULL,
    "mediaUrl" VARCHAR,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "quiz_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "base_company_course_subscription" (
    "id" UUID NOT NULL,
    "companyId" UUID NOT NULL,
    "courseId" UUID NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "base_company_course_subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sanity_courses" (
    "id" UUID NOT NULL,
    "santityId" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "sanity_courses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sanity_courses_santityId_key" ON "sanity_courses"("santityId");

-- CreateIndex
CREATE UNIQUE INDEX "base_course_title_key" ON "base_course"("title");

-- AddForeignKey
ALTER TABLE "base_course_module" ADD CONSTRAINT "base_course_module_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "base_course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "module_lesson" ADD CONSTRAINT "module_lesson_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "base_course_module"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "module_quiz" ADD CONSTRAINT "module_quiz_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "base_course_module"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "module_quiz" ADD CONSTRAINT "module_quiz_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "module_lesson"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_options" ADD CONSTRAINT "quiz_options_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "module_quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "base_package_subscription" ADD CONSTRAINT "base_package_subscription_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "base_company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "base_company_course_subscription" ADD CONSTRAINT "base_company_course_subscription_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "base_course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "base_company_course_subscription" ADD CONSTRAINT "base_company_course_subscription_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "base_company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('Email', 'Sms');

-- CreateEnum
CREATE TYPE "MessageStatus" AS ENUM ('Pending', 'Cancelled', 'Sent', 'Received', 'Failed', 'Deleted');

-- CreateEnum
CREATE TYPE "CompanyRequestStatus" AS ENUM ('Approved', 'Onboarded', 'Pending', 'Rejected');

-- CreateTable
CREATE TABLE "base_user" (
    "id" UUID NOT NULL,
    "firstName" VARCHAR NOT NULL,
    "middleName" VARCHAR,
    "lastName" VARCHAR NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "base_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "allowed_user" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "allowed_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "base_company" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "code" VARCHAR(20) NOT NULL,
    "logo" VARCHAR,
    "phone" VARCHAR(50) NOT NULL,
    "countryId" UUID NOT NULL,
    "stateId" UUID NOT NULL,
    "address1" VARCHAR(150) NOT NULL,
    "address2" VARCHAR(150),
    "townCity" VARCHAR(50),
    "postCode" VARCHAR,
    "mission" VARCHAR,
    "vision" VARCHAR,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "base_company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "base_company_value" (
    "id" UUID NOT NULL,
    "companyId" UUID NOT NULL,
    "value" VARCHAR(255) NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "base_company_value_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "base_user_company" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "companyId" UUID NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "base_user_company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "base_package" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "unitPrice" DOUBLE PRECISION NOT NULL,
    "discount" DOUBLE PRECISION DEFAULT 0,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "base_package_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "base_course" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "url" TEXT,
    "quiz" TEXT,
    "lesson" TEXT,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "base_course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "base_package_course" (
    "id" UUID NOT NULL,
    "packageId" UUID NOT NULL,
    "courseId" UUID NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "base_package_course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "base_template" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "base_template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "base_package_templates" (
    "id" UUID NOT NULL,
    "packageId" UUID NOT NULL,
    "templateId" UUID NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "base_package_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "base_package_subscription" (
    "id" UUID NOT NULL,
    "packageId" UUID NOT NULL,
    "startDate" TIMESTAMPTZ(6) NOT NULL,
    "endDate" TIMESTAMPTZ(6) NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "base_package_subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "waitlist" (
    "id" UUID NOT NULL,
    "firstName" VARCHAR(255) NOT NULL,
    "lastName" VARCHAR(255) NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "waitlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "base_message" (
    "id" UUID NOT NULL,
    "type" "MessageType" NOT NULL DEFAULT 'Email',
    "bindings" JSONB NOT NULL,
    "templateId" UUID,
    "companyId" UUID NOT NULL,
    "status" "MessageStatus" NOT NULL DEFAULT 'Pending',
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "base_message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "base_message_file" (
    "id" UUID NOT NULL,
    "filePath" VARCHAR(255) NOT NULL,
    "isAttachment" BOOLEAN NOT NULL DEFAULT true,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "templateId" UUID NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "base_message_file_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "base_message_template" (
    "id" UUID NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "code" VARCHAR(20) NOT NULL,
    "type" "MessageType" NOT NULL DEFAULT 'Email',
    "subject" VARCHAR(255),
    "isHtml" BOOLEAN NOT NULL DEFAULT false,
    "body" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "base_message_template_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "base_user_email_key" ON "base_user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "allowed_user_email_key" ON "allowed_user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "base_company_name_key" ON "base_company"("name");

-- CreateIndex
CREATE UNIQUE INDEX "base_company_email_key" ON "base_company"("email");

-- CreateIndex
CREATE UNIQUE INDEX "base_company_code_key" ON "base_company"("code");

-- CreateIndex
CREATE UNIQUE INDEX "base_package_name_key" ON "base_package"("name");

-- CreateIndex
CREATE UNIQUE INDEX "base_course_name_key" ON "base_course"("name");

-- CreateIndex
CREATE UNIQUE INDEX "base_template_name_key" ON "base_template"("name");

-- CreateIndex
CREATE UNIQUE INDEX "waitlist_email_key" ON "waitlist"("email");

-- CreateIndex
CREATE UNIQUE INDEX "base_message_file_filePath_key" ON "base_message_file"("filePath");

-- CreateIndex
CREATE UNIQUE INDEX "base_message_template_code_key" ON "base_message_template"("code");

-- AddForeignKey
ALTER TABLE "base_company_value" ADD CONSTRAINT "base_company_value_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "base_company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "base_user_company" ADD CONSTRAINT "base_user_company_userId_fkey" FOREIGN KEY ("userId") REFERENCES "base_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "base_user_company" ADD CONSTRAINT "base_user_company_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "base_company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "base_package_course" ADD CONSTRAINT "base_package_course_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "base_package"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "base_package_course" ADD CONSTRAINT "base_package_course_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "base_course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "base_package_templates" ADD CONSTRAINT "base_package_templates_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "base_package"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "base_package_templates" ADD CONSTRAINT "base_package_templates_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "base_template"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "base_package_subscription" ADD CONSTRAINT "base_package_subscription_packageId_fkey" FOREIGN KEY ("packageId") REFERENCES "base_package"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "base_message" ADD CONSTRAINT "base_message_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "base_message_template"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "base_message" ADD CONSTRAINT "base_message_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "base_company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "base_message_file" ADD CONSTRAINT "base_message_file_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "base_message_template"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

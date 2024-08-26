/*
  Warnings:

  - You are about to drop the `company_country` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `company_state` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `company_user` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `core_deparment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `core_employee` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `core_employee_department` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `core_employee_file` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `core_file` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `core_job_level` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `core_job_role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `core_message` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `core_message_file` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `core_message_setting` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `core_message_template` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `core_role` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "EmploymentType" AS ENUM ('Fulltime', 'Contract', 'Internship');

-- DropForeignKey
ALTER TABLE "company_state" DROP CONSTRAINT "company_state_countryId_fkey";

-- DropForeignKey
ALTER TABLE "company_user" DROP CONSTRAINT "company_user_countryId_fkey";

-- DropForeignKey
ALTER TABLE "company_user" DROP CONSTRAINT "company_user_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "company_user" DROP CONSTRAINT "company_user_photoId_fkey";

-- DropForeignKey
ALTER TABLE "company_user" DROP CONSTRAINT "company_user_roleId_fkey";

-- DropForeignKey
ALTER TABLE "company_user" DROP CONSTRAINT "company_user_stateId_fkey";

-- DropForeignKey
ALTER TABLE "core_employee" DROP CONSTRAINT "core_employee_jobRoleId_fkey";

-- DropForeignKey
ALTER TABLE "core_employee_department" DROP CONSTRAINT "core_employee_department_departmentId_fkey";

-- DropForeignKey
ALTER TABLE "core_employee_department" DROP CONSTRAINT "core_employee_department_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "core_employee_file" DROP CONSTRAINT "core_employee_file_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "core_employee_file" DROP CONSTRAINT "core_employee_file_fileId_fkey";

-- DropForeignKey
ALTER TABLE "core_job_role" DROP CONSTRAINT "core_job_role_levelId_fkey";

-- DropForeignKey
ALTER TABLE "core_message" DROP CONSTRAINT "core_message_createdBy_fkey";

-- DropForeignKey
ALTER TABLE "core_message" DROP CONSTRAINT "core_message_templateId_fkey";

-- DropForeignKey
ALTER TABLE "core_message_file" DROP CONSTRAINT "core_message_file_messageId_fkey";

-- DropForeignKey
ALTER TABLE "employee_feedback" DROP CONSTRAINT "employee_feedback_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "employee_shoutout" DROP CONSTRAINT "employee_shoutout_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "employee_sum_up" DROP CONSTRAINT "employee_sum_up_employeeId_fkey";

-- DropForeignKey
ALTER TABLE "user_address" DROP CONSTRAINT "user_address_countryId_fkey";

-- DropForeignKey
ALTER TABLE "user_address" DROP CONSTRAINT "user_address_stateId_fkey";

-- DropForeignKey
ALTER TABLE "user_address" DROP CONSTRAINT "user_address_userId_fkey";

-- DropForeignKey
ALTER TABLE "user_email" DROP CONSTRAINT "user_email_userId_fkey";

-- DropForeignKey
ALTER TABLE "user_next_of_kin" DROP CONSTRAINT "user_next_of_kin_userId_fkey";

-- DropForeignKey
ALTER TABLE "user_phone" DROP CONSTRAINT "user_phone_userId_fkey";

-- DropForeignKey
ALTER TABLE "user_relation" DROP CONSTRAINT "user_relation_userId_fkey";

-- DropTable
DROP TABLE "company_country";

-- DropTable
DROP TABLE "company_state";

-- DropTable
DROP TABLE "company_user";

-- DropTable
DROP TABLE "core_deparment";

-- DropTable
DROP TABLE "core_employee";

-- DropTable
DROP TABLE "core_employee_department";

-- DropTable
DROP TABLE "core_employee_file";

-- DropTable
DROP TABLE "core_file";

-- DropTable
DROP TABLE "core_job_level";

-- DropTable
DROP TABLE "core_job_role";

-- DropTable
DROP TABLE "core_message";

-- DropTable
DROP TABLE "core_message_file";

-- DropTable
DROP TABLE "core_message_setting";

-- DropTable
DROP TABLE "core_message_template";

-- DropTable
DROP TABLE "core_role";

-- CreateTable
CREATE TABLE "country" (
    "id" UUID NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "iso2" CHAR(2) NOT NULL,
    "iso3" CHAR(3) NOT NULL,
    "isoNumeric" VARCHAR(3) NOT NULL,
    "phoneCode" VARCHAR(50) NOT NULL,
    "continent" VARCHAR(20),
    "capital" VARCHAR(50) NOT NULL,
    "timeZone" VARCHAR(50) NOT NULL,
    "currency" VARCHAR(20) NOT NULL,
    "symbol" VARCHAR(5),
    "wholePart" VARCHAR(20),
    "fractionPart" VARCHAR(20),
    "languageCodes" VARCHAR(100),
    "perUserPrice" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "country_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "state" (
    "id" UUID NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "iso2" VARCHAR(10) NOT NULL,
    "countryId" UUID NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "state_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" UUID NOT NULL,
    "firstName" VARCHAR NOT NULL,
    "middleName" VARCHAR,
    "lastName" VARCHAR NOT NULL,
    "maidenName" VARCHAR,
    "formerNames" VARCHAR,
    "dateOfBirth" DATE,
    "password" TEXT,
    "prefix" VARCHAR,
    "suffix" VARCHAR,
    "gender" "Gender",
    "photoId" UUID,
    "preferredLanguage" VARCHAR,
    "lastLogin" TIMESTAMP(3),
    "lastLoginIp" TEXT,
    "roleId" UUID,
    "employeeId" UUID,
    "stateId" UUID,
    "countryId" UUID,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role" (
    "id" UUID NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "description" VARCHAR(500),
    "code" VARCHAR(20) NOT NULL,
    "type" "RoleType" NOT NULL DEFAULT 'Custom',
    "defaultPage" VARCHAR(50),
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee" (
    "id" UUID NOT NULL,
    "employeeNo" VARCHAR(20) NOT NULL,
    "userId" UUID NOT NULL,
    "branchId" UUID,
    "jobRoleId" UUID,
    "employmentType" "EmploymentType" NOT NULL,
    "status" "EmployeeStatus" NOT NULL DEFAULT 'Active',
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,
    "coreFileId" UUID,

    CONSTRAINT "employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee_department" (
    "id" UUID NOT NULL,
    "employeeId" UUID NOT NULL,
    "departmentId" UUID NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "employee_department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee_setting" (
    "id" UUID NOT NULL,
    "prefix" VARCHAR,
    "suffix" VARCHAR,
    "start" INTEGER NOT NULL DEFAULT 1,
    "lastId" INTEGER NOT NULL DEFAULT 0,
    "length" INTEGER NOT NULL DEFAULT 4,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "employee_setting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_user_branch" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "branchId" UUID NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "company_user_branch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_branch" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(50),
    "phone" VARCHAR(50),
    "stateId" UUID NOT NULL,
    "countryId" UUID NOT NULL,
    "apartmentBuilding" VARCHAR(50),
    "address1" VARCHAR(150) NOT NULL,
    "address2" VARCHAR(150),
    "townCity" VARCHAR(50),
    "postCode" VARCHAR(10),
    "longitude" DOUBLE PRECISION,
    "latitude" DOUBLE PRECISION,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "company_branch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deparment" (
    "id" UUID NOT NULL,
    "name" VARCHAR NOT NULL,
    "code" VARCHAR(50),
    "alias" VARCHAR(100),
    "description" VARCHAR(255),
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "deparment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "file" (
    "id" UUID NOT NULL,
    "url" VARCHAR NOT NULL,
    "key" VARCHAR NOT NULL,
    "eTag" VARCHAR,
    "bucket" VARCHAR,
    "name" VARCHAR,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "file_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee_file" (
    "id" UUID NOT NULL,
    "employeeId" UUID NOT NULL,
    "fileId" UUID NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "employee_file_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_role" (
    "id" UUID NOT NULL,
    "levelId" UUID NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "description" VARCHAR(255),
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "job_role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_level" (
    "id" UUID NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "description" VARCHAR(255),
    "rank" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "job_level_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message" (
    "id" UUID NOT NULL,
    "type" "MessageType" NOT NULL,
    "subject" VARCHAR(100),
    "bindings" JSONB NOT NULL,
    "templateId" UUID,
    "direction" INTEGER NOT NULL DEFAULT 0,
    "isDraft" BOOLEAN NOT NULL DEFAULT false,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "status" "MessageStatus" NOT NULL DEFAULT 'Pending',
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message_file" (
    "id" UUID NOT NULL,
    "filePath" VARCHAR NOT NULL,
    "isAttachment" BOOLEAN NOT NULL DEFAULT true,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "messageId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "message_file_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message_template" (
    "id" UUID NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "code" VARCHAR(20),
    "type" "MessageType" NOT NULL DEFAULT 'Email',
    "subject" VARCHAR,
    "isHtml" BOOLEAN NOT NULL DEFAULT false,
    "body" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "message_template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "message_setting" (
    "id" UUID NOT NULL,
    "smsSenderId" VARCHAR,
    "maxPagePerSMS" INTEGER,
    "emailSenderName" VARCHAR,
    "emailSenderAddress" VARCHAR,
    "accessKey" VARCHAR,
    "emailGateway" INTEGER,
    "smsProviderTenantId" TEXT,
    "preferredMailProvider" "MailProvider",
    "smtpHost" VARCHAR,
    "smtpPort" INTEGER,
    "smtpSecure" BOOLEAN NOT NULL DEFAULT true,
    "smtpAuthUser" VARCHAR,
    "smtpAuthPassword" VARCHAR,
    "sendGridApiKey" VARCHAR,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "message_setting_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "country_name_key" ON "country"("name");

-- CreateIndex
CREATE UNIQUE INDEX "country_iso2_key" ON "country"("iso2");

-- CreateIndex
CREATE UNIQUE INDEX "country_iso3_key" ON "country"("iso3");

-- CreateIndex
CREATE UNIQUE INDEX "state_name_key" ON "state"("name");

-- CreateIndex
CREATE UNIQUE INDEX "state_iso2_key" ON "state"("iso2");

-- CreateIndex
CREATE UNIQUE INDEX "user_employeeId_key" ON "user"("employeeId");

-- CreateIndex
CREATE UNIQUE INDEX "role_name_key" ON "role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "role_code_key" ON "role"("code");

-- CreateIndex
CREATE UNIQUE INDEX "employee_employeeNo_key" ON "employee"("employeeNo");

-- CreateIndex
CREATE UNIQUE INDEX "employee_userId_key" ON "employee"("userId");

-- CreateIndex
CREATE INDEX "employee_department_employeeId_departmentId_idx" ON "employee_department"("employeeId", "departmentId");

-- CreateIndex
CREATE UNIQUE INDEX "company_user_branch_userId_branchId_key" ON "company_user_branch"("userId", "branchId");

-- CreateIndex
CREATE UNIQUE INDEX "company_branch_name_key" ON "company_branch"("name");

-- CreateIndex
CREATE INDEX "company_branch_isDefault_idx" ON "company_branch"("isDefault");

-- CreateIndex
CREATE UNIQUE INDEX "deparment_name_key" ON "deparment"("name");

-- CreateIndex
CREATE UNIQUE INDEX "deparment_code_key" ON "deparment"("code");

-- CreateIndex
CREATE UNIQUE INDEX "deparment_alias_key" ON "deparment"("alias");

-- CreateIndex
CREATE UNIQUE INDEX "file_key_key" ON "file"("key");

-- CreateIndex
CREATE UNIQUE INDEX "job_role_levelId_key" ON "job_role"("levelId");

-- CreateIndex
CREATE UNIQUE INDEX "job_role_title_key" ON "job_role"("title");

-- CreateIndex
CREATE UNIQUE INDEX "job_level_title_key" ON "job_level"("title");

-- CreateIndex
CREATE INDEX "message_id_createdBy_idx" ON "message"("id", "createdBy");

-- CreateIndex
CREATE UNIQUE INDEX "message_file_filePath_key" ON "message_file"("filePath");

-- CreateIndex
CREATE UNIQUE INDEX "message_template_code_key" ON "message_template"("code");

-- CreateIndex
CREATE UNIQUE INDEX "message_template_name_type_key" ON "message_template"("name", "type");

-- AddForeignKey
ALTER TABLE "state" ADD CONSTRAINT "state_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "country"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_photoId_fkey" FOREIGN KEY ("photoId") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "state"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "country"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_email" ADD CONSTRAINT "user_email_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_phone" ADD CONSTRAINT "user_phone_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_address" ADD CONSTRAINT "user_address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_address" ADD CONSTRAINT "user_address_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_address" ADD CONSTRAINT "user_address_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "state"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_next_of_kin" ADD CONSTRAINT "user_next_of_kin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_relation" ADD CONSTRAINT "user_relation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "employee" ADD CONSTRAINT "employee_jobRoleId_fkey" FOREIGN KEY ("jobRoleId") REFERENCES "job_role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "employee" ADD CONSTRAINT "employee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee" ADD CONSTRAINT "employee_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "company_branch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_department" ADD CONSTRAINT "employee_department_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "deparment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "employee_department" ADD CONSTRAINT "employee_department_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "company_user_branch" ADD CONSTRAINT "company_user_branch_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "company_branch"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "company_branch" ADD CONSTRAINT "company_branch_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_branch" ADD CONSTRAINT "company_branch_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "state"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_file" ADD CONSTRAINT "employee_file_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "employee_file" ADD CONSTRAINT "employee_file_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "job_role" ADD CONSTRAINT "job_role_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "job_level"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "message_template"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "message_file" ADD CONSTRAINT "message_file_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "message"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "employee_shoutout" ADD CONSTRAINT "employee_shoutout_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_sum_up" ADD CONSTRAINT "employee_sum_up_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_feedback" ADD CONSTRAINT "employee_feedback_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateEnum
CREATE TYPE "RoleType" AS ENUM ('System', 'Custom');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('Male', 'Female', 'Unknown');

-- CreateEnum
CREATE TYPE "RelationshipType" AS ENUM ('Father', 'Mother', 'Husband', 'Wife', 'Son', 'Daughter', 'Brother', 'Sister', 'Nephew', 'Niece');

-- CreateEnum
CREATE TYPE "AddressType" AS ENUM ('Physical', 'Postal');

-- CreateEnum
CREATE TYPE "AddressPurpose" AS ENUM ('Primary', 'Billing', 'Operational', 'Temporary', 'Old');

-- CreateEnum
CREATE TYPE "EmployeeStatus" AS ENUM ('Active', 'Inactive', 'Suspended');

-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('Email', 'Sms');

-- CreateEnum
CREATE TYPE "MessageStatus" AS ENUM ('Pending', 'Processed', 'Cancelled', 'Sent', 'Received', 'Failed', 'Deleted');

-- CreateEnum
CREATE TYPE "MailProvider" AS ENUM ('SendGrid', 'Smtp');

-- CreateEnum
CREATE TYPE "AutomationFrequency" AS ENUM ('Daily', 'Weekly', 'Monthly', 'Yearly');

-- CreateEnum
CREATE TYPE "Mood" AS ENUM ('Terrible', 'Bad', 'Okay', 'Good', 'Excellent');

-- CreateEnum
CREATE TYPE "FeedbackType" AS ENUM ('Complaint', 'Suggestion');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "firstName" VARCHAR NOT NULL,
    "middleName" VARCHAR,
    "lastName" VARCHAR NOT NULL,
    "maidenName" VARCHAR,
    "formerNames" VARCHAR,
    "dateOfBirth" DATE,
    "prefix" VARCHAR,
    "suffix" VARCHAR,
    "gender" "Gender",
    "photoId" UUID,
    "preferredLanguage" VARCHAR,
    "lastLogin" TIMESTAMP(3),
    "lastLoginIp" TEXT,
    "roleId" UUID,
    "employeeId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_email" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "email" VARCHAR NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "user_email_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_phone" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "phone" VARCHAR NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "user_phone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_address" (
    "id" UUID NOT NULL,
    "label" VARCHAR,
    "apartmentBuilding" VARCHAR,
    "address1" VARCHAR NOT NULL,
    "address2" VARCHAR,
    "townCity" VARCHAR,
    "stateId" UUID NOT NULL,
    "countryId" UUID NOT NULL,
    "purpose" VARCHAR,
    "type" VARCHAR,
    "postCode" VARCHAR,
    "userId" UUID NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "user_address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_next_of_kin" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "firstName" VARCHAR NOT NULL,
    "middleName" VARCHAR,
    "lastName" VARCHAR NOT NULL,
    "maidenName" VARCHAR,
    "formerNames" VARCHAR,
    "dateOfBirth" TIMESTAMPTZ(6),
    "relationship" "RelationshipType" NOT NULL,

    CONSTRAINT "user_next_of_kin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_relation" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "firstName" VARCHAR NOT NULL,
    "middleName" VARCHAR,
    "lastName" VARCHAR NOT NULL,
    "maidenName" VARCHAR,
    "formerNames" VARCHAR,
    "dateOfBirth" TIMESTAMPTZ(6),
    "relationship" "RelationshipType" NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "user_relation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core_role" (
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

    CONSTRAINT "core_role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core_employee" (
    "id" UUID NOT NULL,
    "employeeNo" VARCHAR(20) NOT NULL,
    "userId" UUID NOT NULL,
    "contactId" UUID NOT NULL,
    "branchId" UUID NOT NULL,
    "jobRoleId" UUID,
    "status" "EmployeeStatus" NOT NULL DEFAULT 'Active',
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,
    "coreFileId" UUID,

    CONSTRAINT "core_employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core_employee_department" (
    "id" UUID NOT NULL,
    "employeeId" UUID NOT NULL,
    "departmentId" UUID NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "core_employee_department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core_deparment" (
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

    CONSTRAINT "core_deparment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core_file" (
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

    CONSTRAINT "core_file_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core_employee_file" (
    "id" UUID NOT NULL,
    "employeeId" UUID NOT NULL,
    "fileId" UUID NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "core_employee_file_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core_job_role" (
    "id" UUID NOT NULL,
    "levelId" UUID NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "description" VARCHAR(255),
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "core_job_role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core_job_level" (
    "id" UUID NOT NULL,
    "title" VARCHAR(100) NOT NULL,
    "description" VARCHAR(255),
    "rank" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "core_job_level_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core_message" (
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

    CONSTRAINT "core_message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core_message_file" (
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

    CONSTRAINT "core_message_file_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core_message_template" (
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

    CONSTRAINT "core_message_template_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "core_message_setting" (
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

    CONSTRAINT "core_message_setting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee_shoutout" (
    "id" UUID NOT NULL,
    "employeeId" UUID,
    "beneficiaries" TEXT[],
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "employee_shoutout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee_sum_up" (
    "id" UUID NOT NULL,
    "employeeId" UUID NOT NULL,
    "mood" "Mood" NOT NULL,
    "plan" VARCHAR[],
    "past" VARCHAR[],
    "blockers" VARCHAR,
    "support" TEXT[],
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "employee_sum_up_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee_feedback" (
    "id" UUID NOT NULL,
    "employeeId" UUID,
    "type" "FeedbackType" NOT NULL,
    "message" VARCHAR NOT NULL,
    "isResolved" BOOLEAN,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "employee_feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "value_star" (
    "id" UUID NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "value_star_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shoutout_config" (
    "id" UUID NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "shoutout_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "peer_config" (
    "id" UUID NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "peer_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spark_config" (
    "id" UUID NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "spark_config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_sum_up_config" (
    "id" UUID NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "team_sum_up_config_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_email_key" ON "user_email"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_phone_phone_key" ON "user_phone"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "user_next_of_kin_userId_key" ON "user_next_of_kin"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "core_role_name_key" ON "core_role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "core_role_code_key" ON "core_role"("code");

-- CreateIndex
CREATE UNIQUE INDEX "core_employee_employeeNo_key" ON "core_employee"("employeeNo");

-- CreateIndex
CREATE UNIQUE INDEX "core_employee_userId_key" ON "core_employee"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "core_employee_contactId_key" ON "core_employee"("contactId");

-- CreateIndex
CREATE INDEX "core_employee_department_employeeId_departmentId_idx" ON "core_employee_department"("employeeId", "departmentId");

-- CreateIndex
CREATE UNIQUE INDEX "core_deparment_name_key" ON "core_deparment"("name");

-- CreateIndex
CREATE UNIQUE INDEX "core_deparment_code_key" ON "core_deparment"("code");

-- CreateIndex
CREATE UNIQUE INDEX "core_deparment_alias_key" ON "core_deparment"("alias");

-- CreateIndex
CREATE UNIQUE INDEX "core_file_key_key" ON "core_file"("key");

-- CreateIndex
CREATE UNIQUE INDEX "core_job_role_title_key" ON "core_job_role"("title");

-- CreateIndex
CREATE UNIQUE INDEX "core_job_level_title_key" ON "core_job_level"("title");

-- CreateIndex
CREATE INDEX "core_message_id_createdBy_idx" ON "core_message"("id", "createdBy");

-- CreateIndex
CREATE UNIQUE INDEX "core_message_file_filePath_key" ON "core_message_file"("filePath");

-- CreateIndex
CREATE UNIQUE INDEX "core_message_template_code_key" ON "core_message_template"("code");

-- CreateIndex
CREATE UNIQUE INDEX "core_message_template_name_type_key" ON "core_message_template"("name", "type");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "core_role"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_photoId_fkey" FOREIGN KEY ("photoId") REFERENCES "core_file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_email" ADD CONSTRAINT "user_email_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_phone" ADD CONSTRAINT "user_phone_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_address" ADD CONSTRAINT "user_address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_next_of_kin" ADD CONSTRAINT "user_next_of_kin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_relation" ADD CONSTRAINT "user_relation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "core_employee" ADD CONSTRAINT "core_employee_jobRoleId_fkey" FOREIGN KEY ("jobRoleId") REFERENCES "core_job_role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "core_employee" ADD CONSTRAINT "core_employee_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core_employee_department" ADD CONSTRAINT "core_employee_department_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "core_deparment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "core_employee_department" ADD CONSTRAINT "core_employee_department_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "core_employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "core_employee_file" ADD CONSTRAINT "core_employee_file_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "core_employee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "core_employee_file" ADD CONSTRAINT "core_employee_file_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "core_file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "core_job_role" ADD CONSTRAINT "core_job_role_levelId_fkey" FOREIGN KEY ("levelId") REFERENCES "core_job_level"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core_message" ADD CONSTRAINT "core_message_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "core_message_template"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core_message" ADD CONSTRAINT "core_message_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "core_message_file" ADD CONSTRAINT "core_message_file_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "core_message"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "employee_shoutout" ADD CONSTRAINT "employee_shoutout_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "core_employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_sum_up" ADD CONSTRAINT "employee_sum_up_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "core_employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_feedback" ADD CONSTRAINT "employee_feedback_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "core_employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

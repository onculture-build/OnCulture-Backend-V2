/*
  Warnings:

  - You are about to drop the column `countryId` on the `company_user` table. All the data in the column will be lost.
  - You are about to drop the column `stateId` on the `company_user` table. All the data in the column will be lost.
  - The `status` column on the `peer_config` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `shoutout_config` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `spark_config` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `team_sum_up_config` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `value_star` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `peerCallDuration` to the `peer_config` table without a default value. This is not possible if the table is not empty.
  - Added the required column `channelId` to the `shoutout_config` table without a default value. This is not possible if the table is not empty.
  - Added the required column `frequency` to the `shoutout_config` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastScheduleAt` to the `shoutout_config` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nextScheduleAt` to the `shoutout_config` table without a default value. This is not possible if the table is not empty.
  - Added the required column `noOfDaysInterval` to the `shoutout_config` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scheduleDate` to the `shoutout_config` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scheduleTime` to the `shoutout_config` table without a default value. This is not possible if the table is not empty.
  - Added the required column `channelId` to the `spark_config` table without a default value. This is not possible if the table is not empty.
  - Added the required column `frequency` to the `spark_config` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastScheduleAt` to the `spark_config` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nextScheduleAt` to the `spark_config` table without a default value. This is not possible if the table is not empty.
  - Added the required column `noOfDaysInterval` to the `spark_config` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scheduleDate` to the `spark_config` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scheduleTime` to the `spark_config` table without a default value. This is not possible if the table is not empty.
  - Added the required column `channelId` to the `team_sum_up_config` table without a default value. This is not possible if the table is not empty.
  - Added the required column `frequency` to the `team_sum_up_config` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastScheduleAt` to the `team_sum_up_config` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mood` to the `team_sum_up_config` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nextScheduleAt` to the `team_sum_up_config` table without a default value. This is not possible if the table is not empty.
  - Added the required column `noOfDaysInterval` to the `team_sum_up_config` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scheduleDate` to the `team_sum_up_config` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scheduleTime` to the `team_sum_up_config` table without a default value. This is not possible if the table is not empty.
  - Added the required column `channelId` to the `value_star` table without a default value. This is not possible if the table is not empty.
  - Added the required column `frequency` to the `value_star` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastScheduleAt` to the `value_star` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nextScheduleAt` to the `value_star` table without a default value. This is not possible if the table is not empty.
  - Added the required column `noOfDaysInterval` to the `value_star` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scheduleDate` to the `value_star` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scheduleTime` to the `value_star` table without a default value. This is not possible if the table is not empty.
  - Added the required column `votingDuration` to the `value_star` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TemplateFrequency" AS ENUM ('Daily', 'Weekly', 'Monthly', 'Yearly');

-- CreateEnum
CREATE TYPE "TemplateStatus" AS ENUM ('Active', 'Inactive');

-- DropForeignKey
ALTER TABLE "company_user" DROP CONSTRAINT "company_user_countryId_fkey";

-- DropForeignKey
ALTER TABLE "company_user" DROP CONSTRAINT "company_user_stateId_fkey";

-- AlterTable
ALTER TABLE "company_country" ADD COLUMN     "fractionPart" VARCHAR(20),
ADD COLUMN     "perUserPrice" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
ADD COLUMN     "wholePart" VARCHAR(20);

-- AlterTable
ALTER TABLE "company_user" DROP COLUMN "countryId",
DROP COLUMN "stateId";

-- AlterTable
ALTER TABLE "peer_config" ADD COLUMN     "peerCallDuration" TEXT NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "TemplateStatus" NOT NULL DEFAULT 'Inactive';

-- AlterTable
ALTER TABLE "shoutout_config" ADD COLUMN     "anonymous" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "channelId" TEXT NOT NULL,
ADD COLUMN     "frequency" "TemplateFrequency" NOT NULL,
ADD COLUMN     "lastScheduleAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "nextScheduleAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "noOfDaysInterval" INTEGER NOT NULL,
ADD COLUMN     "scheduleDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "scheduleDay" INTEGER[],
ADD COLUMN     "scheduleTime" TIMESTAMP(3) NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "TemplateStatus" NOT NULL DEFAULT 'Inactive';

-- AlterTable
ALTER TABLE "spark_config" ADD COLUMN     "anonymous" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "channelId" TEXT NOT NULL,
ADD COLUMN     "frequency" "TemplateFrequency" NOT NULL,
ADD COLUMN     "lastScheduleAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "nextScheduleAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "noOfDaysInterval" INTEGER NOT NULL,
ADD COLUMN     "scheduleDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "scheduleDay" INTEGER[],
ADD COLUMN     "scheduleTime" TIMESTAMP(3) NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "TemplateStatus" NOT NULL DEFAULT 'Inactive';

-- AlterTable
ALTER TABLE "team_sum_up_config" ADD COLUMN     "anonymous" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "blockers" VARCHAR,
ADD COLUMN     "channelId" TEXT NOT NULL,
ADD COLUMN     "frequency" "TemplateFrequency" NOT NULL,
ADD COLUMN     "lastScheduleAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "mood" "Mood" NOT NULL,
ADD COLUMN     "nextScheduleAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "noOfDaysInterval" INTEGER NOT NULL,
ADD COLUMN     "past" VARCHAR[],
ADD COLUMN     "plan" VARCHAR[],
ADD COLUMN     "scheduleDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "scheduleDay" INTEGER[],
ADD COLUMN     "scheduleTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "support" TEXT[],
DROP COLUMN "status",
ADD COLUMN     "status" "TemplateStatus" NOT NULL DEFAULT 'Inactive';

-- AlterTable
ALTER TABLE "value_star" ADD COLUMN     "anonymous" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "channelId" TEXT NOT NULL,
ADD COLUMN     "frequency" "TemplateFrequency" NOT NULL,
ADD COLUMN     "lastScheduleAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "nextScheduleAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "noOfDaysInterval" INTEGER NOT NULL,
ADD COLUMN     "scheduleDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "scheduleDay" INTEGER[],
ADD COLUMN     "scheduleTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "votingDuration" TEXT NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "TemplateStatus" NOT NULL DEFAULT 'Inactive';

-- CreateTable
CREATE TABLE "value_star_categories" (
    "id" SERIAL NOT NULL,
    "categoryName" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "configId" UUID,

    CONSTRAINT "value_star_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fire_side_chats_topic" (
    "id" SERIAL NOT NULL,
    "topic" TEXT NOT NULL,
    "description" TEXT,
    "configId" UUID,

    CONSTRAINT "fire_side_chats_topic_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feedback_config" (
    "id" UUID NOT NULL,
    "status" "TemplateStatus" NOT NULL DEFAULT 'Inactive',
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,
    "frequency" "TemplateFrequency" NOT NULL,
    "scheduleTime" TIMESTAMP(3) NOT NULL,
    "nextScheduleAt" TIMESTAMP(3) NOT NULL,
    "lastScheduleAt" TIMESTAMP(3) NOT NULL,
    "scheduleDate" TIMESTAMP(3) NOT NULL,
    "noOfDaysInterval" INTEGER NOT NULL,
    "scheduleDay" INTEGER[],
    "channelId" TEXT NOT NULL,
    "anonymous" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "feedback_config_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "value_star_categories" ADD CONSTRAINT "value_star_categories_configId_fkey" FOREIGN KEY ("configId") REFERENCES "value_star"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fire_side_chats_topic" ADD CONSTRAINT "fire_side_chats_topic_configId_fkey" FOREIGN KEY ("configId") REFERENCES "spark_config"("id") ON DELETE SET NULL ON UPDATE CASCADE;

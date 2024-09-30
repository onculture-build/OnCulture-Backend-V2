/*
  Warnings:

  - The values [Sandbox,Production] on the enum `IntegrationEnvironment` will be removed. If these variants are still used in the database, this will fail.
  - The values [Slack,Whatsapp,Teams,Zoom,Google] on the enum `IntegrationType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `type` on the `integrations_config` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[integration_type,version,environment,source]` on the table `integrations_config` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `source` to the `integrations_config` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "IntegrationSource" AS ENUM ('slack', 'whatsapp', 'teams', 'zoom', 'google');

-- AlterEnum
BEGIN;
CREATE TYPE "IntegrationEnvironment_new" AS ENUM ('staging', 'production');
ALTER TABLE "integrations_config" ALTER COLUMN "environment" TYPE "IntegrationEnvironment_new" USING ("environment"::text::"IntegrationEnvironment_new");
ALTER TYPE "IntegrationEnvironment" RENAME TO "IntegrationEnvironment_old";
ALTER TYPE "IntegrationEnvironment_new" RENAME TO "IntegrationEnvironment";
DROP TYPE "IntegrationEnvironment_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "IntegrationType_new" AS ENUM ('template');
ALTER TABLE "integrations_config" ALTER COLUMN "integration_type" TYPE "IntegrationType_new" USING ("integration_type"::text::"IntegrationType_new");
ALTER TYPE "IntegrationType" RENAME TO "IntegrationType_old";
ALTER TYPE "IntegrationType_new" RENAME TO "IntegrationType";
DROP TYPE "IntegrationType_old";
COMMIT;

-- DropIndex
DROP INDEX "integrations_config_type_version_environment_key";

-- AlterTable
ALTER TABLE "integrations_config" DROP COLUMN "type",
ADD COLUMN     "integration_type" "IntegrationType" NOT NULL DEFAULT 'template',
ADD COLUMN     "source" "IntegrationSource" NOT NULL,
ALTER COLUMN "version" SET DEFAULT 1;

-- CreateIndex
CREATE UNIQUE INDEX "integrations_config_integration_type_version_environment_so_key" ON "integrations_config"("integration_type", "version", "environment", "source");

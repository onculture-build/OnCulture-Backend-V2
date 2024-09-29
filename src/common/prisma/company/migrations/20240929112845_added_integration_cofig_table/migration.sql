-- CreateEnum
CREATE TYPE "IntegrationType" AS ENUM ('Slack', 'Whatsapp', 'Teams', 'Zoom', 'Google');

-- CreateEnum
CREATE TYPE "IntegrationEnvironment" AS ENUM ('Sandbox', 'Production');

-- CreateTable
CREATE TABLE "integrations_config" (
    "id" UUID NOT NULL,
    "config_meta" JSONB NOT NULL,
    "type" "IntegrationType" NOT NULL,
    "version" INTEGER NOT NULL,
    "environment" "IntegrationEnvironment" NOT NULL,
    "redirect_uri" VARCHAR,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "integrations_config_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "integrations_config_type_version_environment_key" ON "integrations_config"("type", "version", "environment");

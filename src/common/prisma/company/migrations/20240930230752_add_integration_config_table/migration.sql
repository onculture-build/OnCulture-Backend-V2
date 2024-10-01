-- CreateEnum
CREATE TYPE "IntegrationType" AS ENUM ('template');

-- CreateEnum
CREATE TYPE "IntegrationSource" AS ENUM ('slack', 'whatsapp', 'teams', 'zoom', 'google');

-- CreateEnum
CREATE TYPE "IntegrationEnvironment" AS ENUM ('staging', 'production');

-- CreateTable
CREATE TABLE "integrations_config" (
    "id" UUID NOT NULL,
    "config_meta" JSONB NOT NULL,
    "integration_type" "IntegrationType" NOT NULL DEFAULT 'template',
    "source" "IntegrationSource" NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "environment" "IntegrationEnvironment" NOT NULL,
    "redirect_uri" VARCHAR,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "integrations_config_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "integrations_config_integration_type_version_environment_so_key" ON "integrations_config"("integration_type", "version", "environment", "source");

/*
  Warnings:

  - You are about to drop the `role` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateTable
CREATE TABLE "user_role" (
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

    CONSTRAINT "user_role_pkey" PRIMARY KEY ("id")
);

-- Copy data from old table to new table
INSERT INTO "user_role" ("id", "name", "description", "code", "type", "defaultPage", "status", "createdAt", "createdBy", "updatedAt", "updatedBy")
SELECT "id", "name", "description", "code", "type", "defaultPage", "status", "createdAt", "createdBy", "updatedAt", "updatedBy"
FROM "role";

-- DropForeignKey
ALTER TABLE "role_menu_permission" DROP CONSTRAINT "role_menu_permission_roleId_fkey";

-- DropForeignKey
ALTER TABLE "role_permission" DROP CONSTRAINT "role_permission_roleId_fkey";

-- DropForeignKey
ALTER TABLE "user" DROP CONSTRAINT "user_roleId_fkey";

-- DropTable
DROP TABLE "role";

-- CreateIndex
CREATE UNIQUE INDEX "user_role_name_key" ON "user_role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "user_role_code_key" ON "user_role"("code");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "user_role"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permission" ADD CONSTRAINT "role_permission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "user_role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "role_menu_permission" ADD CONSTRAINT "role_menu_permission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "user_role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

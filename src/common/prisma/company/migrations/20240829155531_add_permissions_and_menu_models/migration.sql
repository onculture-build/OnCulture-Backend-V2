-- CreateTable
CREATE TABLE "permission" (
    "id" UUID NOT NULL,
    "action" VARCHAR(20) NOT NULL,
    "subject" VARCHAR(50) NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_permission" (
    "id" UUID NOT NULL,
    "roleId" UUID NOT NULL,
    "permissionId" UUID NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "role_permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "module" (
    "id" UUID NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "code" VARCHAR(20) NOT NULL,
    "path" VARCHAR(50),
    "icon" VARCHAR(20),
    "shortDescription" VARCHAR(255) NOT NULL,
    "sequence" SMALLINT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "module_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "module_menu" (
    "id" UUID NOT NULL,
    "label" VARCHAR(50) NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "path" VARCHAR(100) NOT NULL,
    "icon" VARCHAR(20),
    "sequence" SMALLINT NOT NULL,
    "parentId" UUID,
    "moduleId" UUID NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "module_menu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_menu_permission" (
    "id" UUID NOT NULL,
    "roleId" UUID NOT NULL,
    "moduleMenuId" UUID NOT NULL,
    "permission" BOOLEAN NOT NULL DEFAULT false,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "role_menu_permission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "permission_action_subject_idx" ON "permission"("action", "subject");

-- CreateIndex
CREATE UNIQUE INDEX "role_permission_roleId_permissionId_key" ON "role_permission"("roleId", "permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "module_name_key" ON "module"("name");

-- CreateIndex
CREATE UNIQUE INDEX "module_code_key" ON "module"("code");

-- CreateIndex
CREATE UNIQUE INDEX "module_path_key" ON "module"("path");

-- CreateIndex
CREATE UNIQUE INDEX "module_menu_code_key" ON "module_menu"("code");

-- CreateIndex
CREATE UNIQUE INDEX "role_menu_permission_roleId_moduleMenuId_key" ON "role_menu_permission"("roleId", "moduleMenuId");

-- AddForeignKey
ALTER TABLE "role_permission" ADD CONSTRAINT "role_permission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "role_permission" ADD CONSTRAINT "role_permission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "permission"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "module_menu" ADD CONSTRAINT "module_menu_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "module"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "module_menu" ADD CONSTRAINT "module_menu_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "module_menu"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "role_menu_permission" ADD CONSTRAINT "role_menu_permission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "role_menu_permission" ADD CONSTRAINT "role_menu_permission_moduleMenuId_fkey" FOREIGN KEY ("moduleMenuId") REFERENCES "module_menu"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

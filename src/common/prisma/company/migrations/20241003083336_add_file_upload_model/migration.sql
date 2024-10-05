-- CreateEnum
CREATE TYPE "FileUploadStatus" AS ENUM ('Pending', 'Processing', 'Completed', 'Failed');

-- CreateTable
CREATE TABLE "file_upload" (
    "id" UUID NOT NULL,
    "fileId" UUID NOT NULL,
    "status" "FileUploadStatus" NOT NULL DEFAULT 'Pending',
    "errorMessage" VARCHAR,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "file_upload_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "file_upload" ADD CONSTRAINT "file_upload_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

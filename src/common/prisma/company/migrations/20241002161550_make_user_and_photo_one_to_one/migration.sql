/*
  Warnings:

  - A unique constraint covering the columns `[photoId]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "file" ADD COLUMN     "userId" UUID;

-- CreateIndex
CREATE UNIQUE INDEX "user_photoId_key" ON "user"("photoId");

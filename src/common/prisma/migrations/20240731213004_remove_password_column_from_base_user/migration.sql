/*
  Warnings:

  - You are about to drop the column `password` on the `base_user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "base_user" DROP COLUMN "password",
ALTER COLUMN "email" SET DATA TYPE VARCHAR;

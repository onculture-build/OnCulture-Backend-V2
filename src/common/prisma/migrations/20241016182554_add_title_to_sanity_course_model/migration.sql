/*
  Warnings:

  - Added the required column `title` to the `sanity_course` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "sanity_course" ADD COLUMN     "title" VARCHAR NOT NULL;

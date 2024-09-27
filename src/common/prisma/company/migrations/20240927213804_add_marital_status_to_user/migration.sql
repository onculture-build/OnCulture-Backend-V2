-- CreateEnum
CREATE TYPE "MaritalStatus" AS ENUM ('Single', 'Married', 'Divorced', 'Separated', 'Widowed');

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "maritalStatus" "MaritalStatus";

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "bankId" UUID,
ADD COLUMN     "linkedInURL" TEXT;

-- CreateTable
CREATE TABLE "user_emergency_contact" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "firstName" VARCHAR NOT NULL,
    "middleName" VARCHAR,
    "lastName" VARCHAR NOT NULL,
    "maidenName" VARCHAR,
    "formerNames" VARCHAR,
    "dateOfBirth" TIMESTAMPTZ(6),
    "relationship" "RelationshipType" NOT NULL,

    CONSTRAINT "user_emergency_contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_bank" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "bankName" VARCHAR NOT NULL,
    "accountName" VARCHAR NOT NULL,
    "accountNumber" VARCHAR NOT NULL,
    "swiftCode" VARCHAR,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "user_bank_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_emergency_contact_userId_key" ON "user_emergency_contact"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_bank_userId_key" ON "user_bank"("userId");

-- AddForeignKey
ALTER TABLE "user_emergency_contact" ADD CONSTRAINT "user_emergency_contact_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_bank" ADD CONSTRAINT "user_bank_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

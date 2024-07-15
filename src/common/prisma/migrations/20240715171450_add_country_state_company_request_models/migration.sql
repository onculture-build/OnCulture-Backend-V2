-- CreateTable
CREATE TABLE "base_country" (
    "id" UUID NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "iso2" CHAR(2) NOT NULL,
    "iso3" CHAR(3) NOT NULL,
    "isoNumeric" VARCHAR(3) NOT NULL,
    "phoneCode" VARCHAR(50) NOT NULL,
    "continent" VARCHAR(20),
    "capital" VARCHAR(50) NOT NULL,
    "timeZone" VARCHAR(50) NOT NULL,
    "currency" VARCHAR(20) NOT NULL,
    "symbol" VARCHAR(5),
    "wholePart" VARCHAR(20),
    "fractionPart" VARCHAR(20),
    "languageCodes" VARCHAR(100),
    "perUserPrice" DOUBLE PRECISION NOT NULL DEFAULT 0.00,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "base_country_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "base_state" (
    "id" UUID NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "iso2" VARCHAR(10) NOT NULL,
    "countryId" UUID NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "base_state_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "base_company_request" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(150) NOT NULL,
    "contactEmail" VARCHAR(150) NOT NULL,
    "phone" VARCHAR(50) NOT NULL,
    "countryId" UUID NOT NULL,
    "stateId" UUID NOT NULL,
    "apartmentBuilding" VARCHAR(50),
    "address1" VARCHAR(150) NOT NULL,
    "address2" VARCHAR(150),
    "townCity" VARCHAR(50),
    "code" VARCHAR,
    "postCode" VARCHAR(10),
    "contactInfo" JSONB NOT NULL,
    "status" "CompanyRequestStatus" NOT NULL DEFAULT 'Pending',
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" UUID,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" UUID,

    CONSTRAINT "base_company_request_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "base_country_name_key" ON "base_country"("name");

-- CreateIndex
CREATE UNIQUE INDEX "base_country_iso2_key" ON "base_country"("iso2");

-- CreateIndex
CREATE UNIQUE INDEX "base_country_iso3_key" ON "base_country"("iso3");

-- CreateIndex
CREATE UNIQUE INDEX "base_state_name_key" ON "base_state"("name");

-- CreateIndex
CREATE UNIQUE INDEX "base_state_iso2_key" ON "base_state"("iso2");

-- CreateIndex
CREATE UNIQUE INDEX "base_company_request_name_key" ON "base_company_request"("name");

-- CreateIndex
CREATE UNIQUE INDEX "base_company_request_email_key" ON "base_company_request"("email");

-- CreateIndex
CREATE UNIQUE INDEX "base_company_request_contactEmail_key" ON "base_company_request"("contactEmail");

-- CreateIndex
CREATE UNIQUE INDEX "base_company_request_code_key" ON "base_company_request"("code");

-- AddForeignKey
ALTER TABLE "base_state" ADD CONSTRAINT "base_state_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "base_country"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "base_company" ADD CONSTRAINT "base_company_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "base_country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "base_company" ADD CONSTRAINT "base_company_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "base_state"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

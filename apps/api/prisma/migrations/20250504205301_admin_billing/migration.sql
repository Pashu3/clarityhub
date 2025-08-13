-- CreateEnum
CREATE TYPE "InvoiceFormat" AS ENUM ('PDF', 'HTML', 'CSV');

-- CreateEnum
CREATE TYPE "RefundPolicy" AS ENUM ('FULL_REFUND_WITHIN_7_DAYS', 'PRORATED_REFUND', 'NO_REFUNDS', 'CASE_BY_CASE');

-- CreateTable
CREATE TABLE "billing_settings" (
    "id" TEXT NOT NULL,
    "invoiceFormat" "InvoiceFormat" NOT NULL DEFAULT 'PDF',
    "invoiceNumberFormat" TEXT NOT NULL DEFAULT 'INV-YYYY-###',
    "invoiceRecipients" TEXT[] DEFAULT ARRAY['billing@clarityhub.com']::TEXT[],
    "companyName" TEXT NOT NULL DEFAULT 'ClarityHub Inc',
    "companyAddress" TEXT NOT NULL DEFAULT '123 Tech Lane, San Francisco, CA 94107',
    "companyEmail" TEXT NOT NULL DEFAULT 'billing@clarityhub.com',
    "companyPhone" TEXT NOT NULL DEFAULT '+1 (555) 123-4567',
    "companyWebsite" TEXT NOT NULL DEFAULT 'https://clarityhub.com',
    "companyLogo" TEXT,
    "companyVatNumber" TEXT,
    "companyRegNumber" TEXT,
    "gracePeriod" INTEGER NOT NULL DEFAULT 3,
    "paymentRetryAttempts" INTEGER NOT NULL DEFAULT 3,
    "paymentRetryInterval" INTEGER NOT NULL DEFAULT 2,
    "refundPolicy" "RefundPolicy" NOT NULL DEFAULT 'PRORATED_REFUND',
    "refundPolicyText" TEXT NOT NULL DEFAULT 'Prorated refunds are available for unused subscription periods.',
    "taxRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "taxName" TEXT NOT NULL DEFAULT 'Tax',
    "taxNumber" TEXT,
    "collectTaxInfo" BOOLEAN NOT NULL DEFAULT false,
    "sendPaymentReminders" BOOLEAN NOT NULL DEFAULT true,
    "reminderDaysBefore" INTEGER NOT NULL DEFAULT 3,
    "sendReceiptEmails" BOOLEAN NOT NULL DEFAULT true,
    "sendFailedPaymentAlerts" BOOLEAN NOT NULL DEFAULT true,
    "dunningEnabled" BOOLEAN NOT NULL DEFAULT true,
    "dunningEmailTemplate" TEXT,
    "invoiceEmailSubject" TEXT NOT NULL DEFAULT 'Your ClarityHub Invoice #{invoice_number}',
    "invoiceEmailTemplate" TEXT,
    "receiptEmailSubject" TEXT NOT NULL DEFAULT 'Payment Receipt from ClarityHub',
    "receiptEmailTemplate" TEXT,
    "termsAndConditions" TEXT,
    "privacyPolicy" TEXT,
    "enableAutoProratedCredits" BOOLEAN NOT NULL DEFAULT true,
    "updatedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "billing_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PricingPlanHistory" (
    "id" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "previousMonthlyPrice" DOUBLE PRECISION NOT NULL,
    "previousQuarterlyPrice" DOUBLE PRECISION,
    "previousSemiAnnualPrice" DOUBLE PRECISION,
    "previousAnnualPrice" DOUBLE PRECISION,
    "newMonthlyPrice" DOUBLE PRECISION NOT NULL,
    "newQuarterlyPrice" DOUBLE PRECISION,
    "newSemiAnnualPrice" DOUBLE PRECISION,
    "newAnnualPrice" DOUBLE PRECISION,
    "changedBy" TEXT NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PricingPlanHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PricingPlanHistory_planId_idx" ON "PricingPlanHistory"("planId");

-- CreateIndex
CREATE INDEX "PricingPlanHistory_createdAt_idx" ON "PricingPlanHistory"("createdAt");

-- AddForeignKey
ALTER TABLE "PricingPlanHistory" ADD CONSTRAINT "PricingPlanHistory_planId_fkey" FOREIGN KEY ("planId") REFERENCES "PricingPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
